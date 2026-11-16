import { Resend } from 'resend';
import { IRFQ } from '../models/RFQ';
import { IAfterSalesTicket } from '../models/AfterSalesTicket';
import { ITrainingRegistration } from '../models/TrainingRegistration';
import { ILeadMagnet } from '../models/LeadMagnet';
import { IContactInquiry } from '../models/ContactInquiry';

const getResendClient = (): Resend | null => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_your_api_key_here') {
    return null;
  }
  return new Resend(apiKey);
};

const getFromAddress = (): string =>
  process.env.EMAIL_FROM || 'Sudabelt Medical <notifications@sudabelt.com>';

const getSalesEmail = (): string =>
  process.env.SALES_DESK_EMAIL || 'sales@sudabelt.com';

const getBiomedicalEmail = (): string =>
  process.env.BIOMEDICAL_DESK_EMAIL || 'support@sudabelt.com';

const getTrainingEmail = (): string =>
  process.env.TRAINING_DESK_EMAIL || 'training@sudabelt.com';

const getFrontendUrl = (): string =>
  process.env.FRONTEND_URL || 'https://www.sudabelt.com';

const escapeHtml = (unsafe: string | undefined | null): string => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Shared Sudabelt Brand Email Wrapper
 * Uses #001142 Primary Navy header, #006837 Clinical Green accents,
 * and asymmetric leaf corners (22px top-left & bottom-right).
 */
const wrapSudabeltEmailLayout = (params: {
  badgeText: string;
  headerTitle: string;
  headerSubtitle?: string;
  isUrgentCritical?: boolean;
  bodyHtml: string;
}): string => {
  const accentColor = params.isUrgentCritical ? '#E30000' : '#006837';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(params.headerTitle)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#001142;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F8FAFC;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:22px 0 22px 0;overflow:hidden;">
          <!-- Navy Brand Header -->
          <tr>
            <td style="background-color:#001142;padding:28px 32px;border-bottom:4px solid ${accentColor};">
              <div style="display:inline-block;background-color:${accentColor};color:#FFFFFF;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:5px 10px;border-radius:5.5px;margin-bottom:12px;">
                ${escapeHtml(params.badgeText)}
              </div>
              <h1 style="margin:0;color:#FFFFFF;font-size:22px;font-weight:800;line-height:1.25;letter-spacing:-0.02em;">
                ${escapeHtml(params.headerTitle)}
              </h1>
              ${
                params.headerSubtitle
                  ? `<p style="margin:8px 0 0 0;color:#3FA9F5;font-size:14px;font-weight:600;">${escapeHtml(params.headerSubtitle)}</p>`
                  : ''
              }
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td style="padding:32px;font-size:15px;line-height:1.6;color:#001142;">
              ${params.bodyHtml}
            </td>
          </tr>
          <!-- Institutional Footer -->
          <tr>
            <td style="background-color:#001142;padding:20px 32px;color:#FFFFFF;font-size:12px;line-height:1.5;">
              <strong style="color:#3FA9F5;text-transform:uppercase;letter-spacing:0.06em;">Sudabelt Medical</strong> — Advancing Healthcare Excellence in Africa<br />
              <span style="color:#CBD5E1;">Regional Hubs: Lagos (HQ) • Abuja • Kano • Port Harcourt</span><br />
              <a href="${getFrontendUrl()}" style="color:#3FA9F5;text-decoration:none;font-weight:600;">www.sudabelt.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Helper to dispatch email via Resend or log safely in development if API key is not configured.
 */
const dispatchEmail = async (payload: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ id?: string; simulated?: boolean }> => {
  const resend = getResendClient();
  if (!resend) {
    console.log(
      `[EmailService][Simulated] To: ${Array.isArray(payload.to) ? payload.to.join(', ') : payload.to} | Subject: ${payload.subject}`
    );
    return { simulated: true };
  }

  const { data, error } = await resend.emails.send({
    from: getFromAddress(),
    to: Array.isArray(payload.to) ? payload.to : [payload.to],
    subject: payload.subject,
    html: payload.html,
    replyTo: payload.replyTo,
  });

  if (error) {
    console.error('[EmailService] Resend dispatch error:', error);
    throw new Error(error.message || 'Failed to dispatch email via Resend');
  }

  return { id: data?.id };
};

/**
 * 1. Sends RFQ confirmation to the client and alert notification to the Sudabelt Sales Desk.
 */
export const sendRFQConfirmation = async (
  rfqData: Pick<
    IRFQ,
    | 'referenceId'
    | 'facilityName'
    | 'facilityType'
    | 'location'
    | 'urgency'
    | 'selectedItems'
    | 'slaTier'
    | 'contact'
    | 'tenderAttachmentUrl'
    | 'additionalNotes'
  >
): Promise<void> => {
  const itemsRowsHtml = rfqData.selectedItems
    .map(
      (item, idx) => `
      <tr style="background-color:${idx % 2 === 0 ? '#FFFFFF' : '#F4F6F9'};">
        <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;font-weight:600;">${escapeHtml(item.name)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;font-family:monospace;font-size:13px;">${escapeHtml(item.sku || item.equipmentId || 'N/A')}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;font-family:monospace;font-weight:700;text-align:right;">${item.quantity}</td>
      </tr>`
    )
    .join('');

  const itemsTableHtml = `
    <table width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #E2E8F0;border-radius:5.5px;overflow:hidden;margin:16px 0;">
      <thead>
        <tr style="background-color:#001142;color:#FFFFFF;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">
          <th align="left" style="padding:10px 12px;">Equipment / Consumable</th>
          <th align="left" style="padding:10px 12px;">SKU / Code</th>
          <th align="right" style="padding:10px 12px;">Qty</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRowsHtml}
      </tbody>
    </table>
  `;

  // A. Client Confirmation Email
  const clientBody = `
    <p style="margin-top:0;">Dear <strong>${escapeHtml(rfqData.contact.name)}</strong>,</p>
    <p>Thank you for submitting an institutional Request for Quote (RFQ) with <strong>Sudabelt Medical</strong>. Our Turnkey Healthcare Infrastructure & Biomedical Engineering team has received your specification list for <strong>${escapeHtml(rfqData.facilityName)}</strong>.</p>
    
    <div style="background-color:#F8FAFC;border-left:4px solid #006837;padding:14px 16px;border-radius:5.5px;margin:20px 0;">
      <strong>Reference ID:</strong> <span style="font-family:monospace;font-weight:700;color:#006837;">${escapeHtml(rfqData.referenceId)}</span><br />
      <strong>Facility:</strong> ${escapeHtml(rfqData.facilityName)} (${escapeHtml(rfqData.facilityType)})<br />
      <strong>Location:</strong> ${escapeHtml(rfqData.location.city)}, ${escapeHtml(rfqData.location.state)}<br />
      <strong>Requested SLA Tier:</strong> ${escapeHtml(rfqData.slaTier)}<br />
      <strong>Timeline / Urgency:</strong> ${escapeHtml(rfqData.urgency)}
    </div>

    <h3 style="font-size:16px;margin-bottom:8px;color:#001142;">Requested Equipment & Consumables</h3>
    ${itemsTableHtml}

    <p style="margin-bottom:0;">A dedicated Regional Procurement Specialist will review your site requirements and respond with a formal proforma invoice and turnkey installation schedule within <strong>24 business hours</strong>.</p>
  `;

  const clientHtml = wrapSudabeltEmailLayout({
    badgeText: `RFQ Received • ${rfqData.referenceId}`,
    headerTitle: 'Institutional Quote Request Confirmation',
    headerSubtitle: `${rfqData.facilityName} — ${rfqData.location.city}, ${rfqData.location.state}`,
    bodyHtml: clientBody,
  });

  // B. Sales Desk Alert Email
  const salesBody = `
    <p style="margin-top:0;">A new institutional RFQ has been submitted via the Sudabelt Medical portal.</p>
    <table width="100%" cellspacing="0" cellpadding="6" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:5.5px;margin-bottom:20px;font-size:14px;">
      <tr><td><strong>Reference ID:</strong></td><td style="font-family:monospace;font-weight:700;color:#006837;">${escapeHtml(rfqData.referenceId)}</td></tr>
      <tr><td><strong>Facility:</strong></td><td>${escapeHtml(rfqData.facilityName)} (${escapeHtml(rfqData.facilityType)})</td></tr>
      <tr><td><strong>Location:</strong></td><td>${escapeHtml(rfqData.location.city)}, ${escapeHtml(rfqData.location.state)}</td></tr>
      <tr><td><strong>Urgency:</strong></td><td><strong>${escapeHtml(rfqData.urgency)}</strong></td></tr>
      <tr><td><strong>SLA Tier:</strong></td><td>${escapeHtml(rfqData.slaTier)}</td></tr>
      <tr><td><strong>Contact Person:</strong></td><td>${escapeHtml(rfqData.contact.name)} (${escapeHtml(rfqData.contact.role)})</td></tr>
      <tr><td><strong>Email / Phone:</strong></td><td><a href="mailto:${escapeHtml(rfqData.contact.email)}" style="color:#0A6FC0;">${escapeHtml(rfqData.contact.email)}</a> • ${escapeHtml(rfqData.contact.phone)}</td></tr>
      ${
        rfqData.tenderAttachmentUrl
          ? `<tr><td><strong>Tender Document:</strong></td><td><a href="${escapeHtml(rfqData.tenderAttachmentUrl)}" style="color:#0A6FC0;">View Attachment</a></td></tr>`
          : ''
      }
      ${
        rfqData.additionalNotes
          ? `<tr><td><strong>Notes:</strong></td><td>${escapeHtml(rfqData.additionalNotes)}</td></tr>`
          : ''
      }
    </table>
    <h3 style="font-size:16px;margin-bottom:8px;color:#001142;">Selected Items (${rfqData.selectedItems.length})</h3>
    ${itemsTableHtml}
  `;

  const salesHtml = wrapSudabeltEmailLayout({
    badgeText: 'New Sales Pipeline Lead',
    headerTitle: `New RFQ: ${rfqData.facilityName}`,
    headerSubtitle: `Ref: ${rfqData.referenceId} • Urgency: ${rfqData.urgency}`,
    bodyHtml: salesBody,
  });

  await Promise.allSettled([
    dispatchEmail({
      to: rfqData.contact.email,
      subject: `[${rfqData.referenceId}] Your Sudabelt Medical Quote Request Confirmation`,
      html: clientHtml,
    }),
    dispatchEmail({
      to: getSalesEmail(),
      subject: `[NEW RFQ ${rfqData.referenceId}] ${rfqData.facilityName} (${rfqData.location.state})`,
      html: salesHtml,
      replyTo: rfqData.contact.email,
    }),
  ]);
};

/**
 * 2. Sends Urgent After-Sales Biomedical Support Ticket alert to Biomedical Dispatch.
 */
export const sendSupportTicketAlert = async (
  ticketData: Pick<
    IAfterSalesTicket,
    | 'ticketId'
    | 'hospitalName'
    | 'equipmentModel'
    | 'serialNumber'
    | 'issueType'
    | 'urgencyLevel'
    | 'description'
    | 'contactName'
    | 'email'
    | 'phone'
    | 'locationState'
  >
): Promise<void> => {
  const isCritical = ticketData.urgencyLevel === 'critical_patient_impact';
  const urgencyBannerBg = isCritical ? '#FEF2F2' : '#F0FDF4';
  const urgencyBorder = isCritical ? '#E30000' : '#006837';

  const bodyHtml = `
    <div style="background-color:${urgencyBannerBg};border-left:4px solid ${urgencyBorder};padding:14px 16px;border-radius:5.5px;margin-bottom:20px;">
      <strong style="color:${urgencyBorder};text-transform:uppercase;font-size:12px;letter-spacing:0.06em;">
        Urgency Level: ${escapeHtml(ticketData.urgencyLevel.replace(/_/g, ' '))}
      </strong>
      <div style="margin-top:4px;font-family:monospace;font-size:14px;">
        Ticket ID: <strong>${escapeHtml(ticketData.ticketId)}</strong> • Serial No: <strong>${escapeHtml(ticketData.serialNumber)}</strong>
      </div>
    </div>

    <table width="100%" cellspacing="0" cellpadding="6" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:5.5px;margin-bottom:20px;font-size:14px;">
      <tr><td><strong>Hospital / Facility:</strong></td><td>${escapeHtml(ticketData.hospitalName)}${ticketData.locationState ? ` (${escapeHtml(ticketData.locationState)})` : ''}</td></tr>
      <tr><td><strong>Equipment Model:</strong></td><td><strong>${escapeHtml(ticketData.equipmentModel)}</strong></td></tr>
      <tr><td><strong>Serial Number:</strong></td><td style="font-family:monospace;font-weight:700;">${escapeHtml(ticketData.serialNumber)}</td></tr>
      <tr><td><strong>Issue Classification:</strong></td><td>${escapeHtml(ticketData.issueType.replace(/_/g, ' ').toUpperCase())}</td></tr>
      <tr><td><strong>Site Contact:</strong></td><td>${escapeHtml(ticketData.contactName)} (${escapeHtml(ticketData.phone)})</td></tr>
      ${
        ticketData.email
          ? `<tr><td><strong>Contact Email:</strong></td><td><a href="mailto:${escapeHtml(ticketData.email)}" style="color:#0A6FC0;">${escapeHtml(ticketData.email)}</a></td></tr>`
          : ''
      }
    </table>

    <h3 style="font-size:15px;margin-bottom:6px;color:#001142;">Reported Fault / Service Description</h3>
    <div style="background-color:#F4F6F9;padding:14px 16px;border-radius:5.5px;font-size:14px;white-space:pre-wrap;">${escapeHtml(ticketData.description)}</div>
  `;

  const html = wrapSudabeltEmailLayout({
    badgeText: isCritical ? 'CRITICAL BIOMEDICAL ALERT' : 'Biomedical Dispatch Ticket',
    headerTitle: `${ticketData.ticketId}: ${ticketData.equipmentModel}`,
    headerSubtitle: `${ticketData.hospitalName} • S/N: ${ticketData.serialNumber}`,
    isUrgentCritical: isCritical,
    bodyHtml,
  });

  await dispatchEmail({
    to: getBiomedicalEmail(),
    subject: `${isCritical ? '[URGENT CRITICAL] ' : ''}[${ticketData.ticketId}] ${ticketData.hospitalName} — ${ticketData.equipmentModel} (${ticketData.serialNumber})`,
    html,
    replyTo: ticketData.email,
  });
};

/**
 * 3. Sends Clinical & Biomedical Training Booking Notification to the Training Coordinator.
 */
export const sendTrainingBookingAlert = async (
  trainingData: Pick<
    ITrainingRegistration,
    | 'registrationId'
    | 'institutionName'
    | 'courseTrack'
    | 'numberOfTrainees'
    | 'targetHospitalState'
    | 'contactName'
    | 'contactRole'
    | 'email'
    | 'phone'
    | 'preferredDates'
    | 'notes'
  >
): Promise<void> => {
  const bodyHtml = `
    <p style="margin-top:0;">A new institutional clinical or biomedical training cohort request has been submitted.</p>
    <table width="100%" cellspacing="0" cellpadding="6" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:5.5px;margin-bottom:20px;font-size:14px;">
      <tr><td><strong>Registration ID:</strong></td><td style="font-family:monospace;font-weight:700;color:#006837;">${escapeHtml(trainingData.registrationId)}</td></tr>
      <tr><td><strong>Institution:</strong></td><td><strong>${escapeHtml(trainingData.institutionName)}</strong></td></tr>
      <tr><td><strong>Course Track:</strong></td><td><strong style="color:#006837;">${escapeHtml(trainingData.courseTrack)}</strong></td></tr>
      <tr><td><strong>Trainee Cohort Size:</strong></td><td style="font-family:monospace;font-weight:700;">${trainingData.numberOfTrainees} Staff Members</td></tr>
      <tr><td><strong>Target State / Hub:</strong></td><td>${escapeHtml(trainingData.targetHospitalState)}</td></tr>
      <tr><td><strong>Coordinator Contact:</strong></td><td>${escapeHtml(trainingData.contactName)} (${escapeHtml(trainingData.contactRole)})</td></tr>
      <tr><td><strong>Email / Phone:</strong></td><td><a href="mailto:${escapeHtml(trainingData.email)}" style="color:#0A6FC0;">${escapeHtml(trainingData.email)}</a> • ${escapeHtml(trainingData.phone)}</td></tr>
      ${
        trainingData.preferredDates
          ? `<tr><td><strong>Preferred Dates:</strong></td><td>${escapeHtml(trainingData.preferredDates)}</td></tr>`
          : ''
      }
      ${
        trainingData.notes
          ? `<tr><td><strong>Additional Notes:</strong></td><td>${escapeHtml(trainingData.notes)}</td></tr>`
          : ''
      }
    </table>
  `;

  const html = wrapSudabeltEmailLayout({
    badgeText: 'Clinical Training Hub',
    headerTitle: `Training Cohort Request: ${trainingData.institutionName}`,
    headerSubtitle: `${trainingData.courseTrack} (${trainingData.numberOfTrainees} Trainees)`,
    bodyHtml,
  });

  await dispatchEmail({
    to: getTrainingEmail(),
    subject: `[TRAINING ${trainingData.registrationId}] ${trainingData.institutionName} — ${trainingData.courseTrack}`,
    html,
    replyTo: trainingData.email,
  });
};

/**
 * 4. Delivers the requested technical datasheet PDF link to the user's inbox.
 */
export const sendLeadMagnetWelcome = async (
  leadData: Pick<
    ILeadMagnet,
    | 'name'
    | 'workEmail'
    | 'phone'
    | 'facilityName'
    | 'downloadedAssetSlug'
    | 'downloadedAssetTitle'
    | 'downloadedAssetUrl'
  >
): Promise<void> => {
  const assetTitle =
    leadData.downloadedAssetTitle ||
    leadData.downloadedAssetSlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const resolvedDownloadUrl = leadData.downloadedAssetUrl
    ? leadData.downloadedAssetUrl.startsWith('http')
      ? leadData.downloadedAssetUrl
      : `${getFrontendUrl()}${leadData.downloadedAssetUrl}`
    : `${getFrontendUrl()}/docs/datasheets/${leadData.downloadedAssetSlug}.pdf`;

  const bodyHtml = `
    <p style="margin-top:0;">Dear <strong>${escapeHtml(leadData.name)}</strong>,</p>
    <p>Thank you for requesting technical documentation from <strong>Sudabelt Medical</strong> for <strong>${escapeHtml(leadData.facilityName)}</strong>.</p>
    <p>You can access and download your requested technical datasheet and clinical specification package using the direct link below:</p>

    <div style="background-color:#001142;padding:24px;border-radius:22px 0 22px 0;margin:24px 0;text-align:center;">
      <div style="color:#FFFFFF;font-size:16px;font-weight:700;margin-bottom:14px;">
        ${escapeHtml(assetTitle)}
      </div>
      <a href="${escapeHtml(resolvedDownloadUrl)}" style="display:inline-block;background-color:#3FA9F5;color:#001142;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;text-decoration:none;padding:12px 24px;border-radius:5.5px;">
        Download Technical Datasheet (PDF)
      </a>
    </div>

    <div style="background-color:#F8FAFC;border-left:4px solid #006837;padding:14px 16px;border-radius:5.5px;margin-top:20px;font-size:14px;">
      <strong>Need Pre-Installation Site Engineering or an Institutional Quote?</strong><br />
      Sudabelt Medical provides end-to-end RO water integration, electrical auditing, 40–60 hours of on-site clinical nurse training, and &lt;24hr biomedical maintenance SLAs across Nigeria.
    </div>
  `;

  const html = wrapSudabeltEmailLayout({
    badgeText: 'Technical Documentation Library',
    headerTitle: `Your Technical Datasheet: ${assetTitle}`,
    headerSubtitle: `Prepared for ${leadData.facilityName}`,
    bodyHtml,
  });

  await dispatchEmail({
    to: leadData.workEmail,
    subject: `Technical Datasheet: ${assetTitle} | Sudabelt Medical`,
    html,
  });
};

/**
 * 5. Sends Department-Routed Contact Inquiry Alert to the appropriate Sudabelt Desk.
 */
export const sendContactInquiryAlert = async (
  inquiryData: Pick<
    IContactInquiry,
    'name' | 'email' | 'phone' | 'facilityName' | 'department' | 'message'
  >
): Promise<void> => {
  const departmentEmailMap: Record<IContactInquiry['department'], string> = {
    sales: getSalesEmail(),
    biomedical_sla: getBiomedicalEmail(),
    training: getTrainingEmail(),
    general: process.env.GENERAL_DESK_EMAIL || getSalesEmail(),
  };

  const targetEmail = departmentEmailMap[inquiryData.department] || getSalesEmail();
  const departmentLabel = inquiryData.department.replace(/_/g, ' ').toUpperCase();

  const bodyHtml = `
    <p style="margin-top:0;">A new contact inquiry has been routed to the <strong>${escapeHtml(departmentLabel)}</strong> desk.</p>
    <table width="100%" cellspacing="0" cellpadding="6" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:5.5px;margin-bottom:20px;font-size:14px;">
      <tr><td><strong>Sender Name:</strong></td><td><strong>${escapeHtml(inquiryData.name)}</strong></td></tr>
      ${
        inquiryData.facilityName
          ? `<tr><td><strong>Facility / Organization:</strong></td><td>${escapeHtml(inquiryData.facilityName)}</td></tr>`
          : ''
      }
      <tr><td><strong>Department Routing:</strong></td><td><strong style="color:#006837;">${escapeHtml(departmentLabel)}</strong></td></tr>
      <tr><td><strong>Email:</strong></td><td><a href="mailto:${escapeHtml(inquiryData.email)}" style="color:#0A6FC0;">${escapeHtml(inquiryData.email)}</a></td></tr>
      <tr><td><strong>Phone:</strong></td><td>${escapeHtml(inquiryData.phone)}</td></tr>
    </table>
    <h3 style="font-size:15px;margin-bottom:6px;color:#001142;">Message Content</h3>
    <div style="background-color:#F4F6F9;padding:14px 16px;border-radius:5.5px;font-size:14px;white-space:pre-wrap;">${escapeHtml(inquiryData.message)}</div>
  `;

  const html = wrapSudabeltEmailLayout({
    badgeText: `Contact Desk • ${departmentLabel}`,
    headerTitle: `New Inquiry from ${inquiryData.name}`,
    headerSubtitle: inquiryData.facilityName || inquiryData.email,
    bodyHtml,
  });

  await dispatchEmail({
    to: targetEmail,
    subject: `[INQUIRY - ${departmentLabel}] ${inquiryData.name}${inquiryData.facilityName ? ` (${inquiryData.facilityName})` : ''}`,
    html,
    replyTo: inquiryData.email,
  });
};

