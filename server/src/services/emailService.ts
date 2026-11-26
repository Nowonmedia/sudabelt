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
  process.env.SALES_DESK_EMAIL || 'contact@sudabelt.com';

const getBiomedicalEmail = (): string =>
  process.env.AFTER_SALES_EMAIL || process.env.BIOMEDICAL_DESK_EMAIL || 'support@sudabelt.com';

const getTrainingEmail = (): string =>
  process.env.TRAINING_EMAIL || process.env.TRAINING_DESK_EMAIL || 'contact@sudabelt.com';

const getContactEmail = (): string =>
  process.env.CONTACT_EMAIL || process.env.GENERAL_DESK_EMAIL || 'info@sudabelt.com';

const getFrontendUrl = (): string =>
  process.env.FRONTEND_URL || 'https://www.sudabelt.com';

const formatSubmissionTimestamp = (): string =>
  new Date().toLocaleString('en-GB', {
    timeZone: 'Africa/Lagos',
    dateStyle: 'medium',
    timeStyle: 'short',
  }) + ' WAT';

const buildWebsiteOriginNotice = (params: {
  formName: string;
  pagePath: string;
  actionSummary: string;
}): string => `
  <div style="background-color:#EFF6FF;border:1px solid #BFDBFE;border-left:4px solid #0A6FC0;padding:12px 16px;border-radius:5.5px;margin-bottom:20px;font-size:13px;line-height:1.5;color:#1E3A8A;">
    <strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#001142;margin-bottom:4px;">
      Official Website Submission • ${escapeHtml(params.formName)}
    </strong>
    This message was automatically generated from the <strong>Sudabelt Medical website</strong> (<a href="${getFrontendUrl()}${escapeHtml(params.pagePath)}" style="color:#0A6FC0;font-weight:600;text-decoration:none;">${escapeHtml(getFrontendUrl().replace(/^https?:\/\//, ''))}${escapeHtml(params.pagePath)}</a>) on <strong>${escapeHtml(formatSubmissionTimestamp())}</strong>.<br />
    <span>${escapeHtml(params.actionSummary)} You can reply directly to this email to respond to the sender.</span>
  </div>
`;

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
    ${buildWebsiteOriginNotice({
      formName: 'Institutional Request for Quote (RFQ) Form',
      pagePath: '/rfq',
      actionSummary: `A prospective client from ${rfqData.facilityName} (${rfqData.location.city}, ${rfqData.location.state}) submitted an equipment/consumables quotation request covering ${rfqData.selectedItems.length} item(s).`,
    })}
    <p style="margin-top:0;">Please review the facility profile, urgency level, and requested specification list below so the Sales &amp; Procurement team can prepare a scoped quotation.</p>
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
    badgeText: 'Sudabelt Website • New RFQ Submission',
    headerTitle: `New Website RFQ: ${rfqData.facilityName}`,
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
      subject: `[Sudabelt Website • NEW RFQ ${rfqData.referenceId}] ${rfqData.facilityName} (${rfqData.location.state})`,
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
    ${buildWebsiteOriginNotice({
      formName: 'After-Sales & Biomedical Support Form',
      pagePath: '/support',
      actionSummary: `${ticketData.contactName} from ${ticketData.hospitalName} logged a ${ticketData.issueType.replace(/_/g, ' ')} request for ${ticketData.equipmentModel} (S/N: ${ticketData.serialNumber}).`,
    })}
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
    badgeText: isCritical ? 'Sudabelt Website • CRITICAL BIOMEDICAL ALERT' : 'Sudabelt Website • Biomedical Support Ticket',
    headerTitle: `${ticketData.ticketId}: ${ticketData.equipmentModel}`,
    headerSubtitle: `${ticketData.hospitalName} • S/N: ${ticketData.serialNumber}`,
    isUrgentCritical: isCritical,
    bodyHtml,
  });

  const emailTasks: Promise<unknown>[] = [
    dispatchEmail({
      to: getBiomedicalEmail(),
      subject: `[Sudabelt Website • ${isCritical ? 'URGENT CRITICAL ' : ''}SUPPORT ${ticketData.ticketId}] ${ticketData.hospitalName} - ${ticketData.equipmentModel}`,
      html,
      replyTo: ticketData.email,
    }),
  ];

  if (ticketData.email) {
    const userBodyHtml = `
      <p style="margin-top:0;">Dear <strong>${escapeHtml(ticketData.contactName)}</strong>,</p>
      <p>Thank you for contacting <strong>Sudabelt Medical After-Sales &amp; Biomedical Support</strong>. Your support request has been received and logged with our engineering dispatch desk.</p>
      <div style="background-color:#F8FAFC;border-left:4px solid #006837;padding:14px 16px;border-radius:5.5px;margin:20px 0;">
        <strong>Ticket Reference:</strong> <span style="font-family:monospace;font-weight:700;color:#006837;">${escapeHtml(ticketData.ticketId)}</span><br />
        <strong>Hospital / Facility:</strong> ${escapeHtml(ticketData.hospitalName)}<br />
        <strong>Equipment Model:</strong> ${escapeHtml(ticketData.equipmentModel)} (S/N: ${escapeHtml(ticketData.serialNumber)})<br />
        <strong>Issue Type:</strong> ${escapeHtml(ticketData.issueType.replace(/_/g, ' ').toUpperCase())}
      </div>
      <p style="margin-bottom:0;">A certified Sudabelt biomedical engineer will review your ticket and get back to you as soon as possible.</p>
    `;

    const userHtml = wrapSudabeltEmailLayout({
      badgeText: `Support Ticket Received • ${ticketData.ticketId}`,
      headerTitle: 'We Have Received Your Support Request',
      headerSubtitle: `${ticketData.hospitalName} • ${ticketData.equipmentModel}`,
      bodyHtml: userBodyHtml,
    });

    emailTasks.push(
      dispatchEmail({
        to: ticketData.email,
        subject: `[${ticketData.ticketId}] Support Request Received | Sudabelt Medical`,
        html: userHtml,
      })
    );
  }

  await Promise.allSettled(emailTasks);
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
    ${buildWebsiteOriginNotice({
      formName: 'Clinical & Biomedical Training Enquiry Form',
      pagePath: '/training-hub',
      actionSummary: `${trainingData.contactName} (${trainingData.contactRole}) at ${trainingData.institutionName} submitted a training inquiry for "${trainingData.courseTrack}" (${trainingData.numberOfTrainees} trainee(s), ${trainingData.targetHospitalState}).`,
    })}
    <p style="margin-top:0;">Please review the cohort details below and follow up with the institution coordinator regarding training schedule and curriculum availability.</p>
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
    badgeText: 'Sudabelt Website • Training Enquiry',
    headerTitle: `Training Cohort Request: ${trainingData.institutionName}`,
    headerSubtitle: `${trainingData.courseTrack} (${trainingData.numberOfTrainees} Trainees)`,
    bodyHtml,
  });

  const userBodyHtml = `
    <p style="margin-top:0;">Dear <strong>${escapeHtml(trainingData.contactName)}</strong>,</p>
    <p>Thank you for submitting a clinical &amp; biomedical training request with the <strong>Sudabelt Medical Training Hub</strong>. We have received your cohort registration for <strong>${escapeHtml(trainingData.institutionName)}</strong>.</p>
    <div style="background-color:#F8FAFC;border-left:4px solid #006837;padding:14px 16px;border-radius:5.5px;margin:20px 0;">
      <strong>Registration ID:</strong> <span style="font-family:monospace;font-weight:700;color:#006837;">${escapeHtml(trainingData.registrationId)}</span><br />
      <strong>Course Track:</strong> ${escapeHtml(trainingData.courseTrack)}<br />
      <strong>Number of Trainees:</strong> ${trainingData.numberOfTrainees}<br />
      <strong>Target State:</strong> ${escapeHtml(trainingData.targetHospitalState)}
    </div>
    <p style="margin-bottom:0;">Our Training Coordinator will review your schedule preferences and get back to you as soon as possible.</p>
  `;

  const userHtml = wrapSudabeltEmailLayout({
    badgeText: `Training Request Received • ${trainingData.registrationId}`,
    headerTitle: 'We Have Received Your Training Request',
    headerSubtitle: `${trainingData.institutionName} • ${trainingData.courseTrack}`,
    bodyHtml: userBodyHtml,
  });

  await Promise.allSettled([
    dispatchEmail({
      to: getTrainingEmail(),
      subject: `[Sudabelt Website • TRAINING ${trainingData.registrationId}] ${trainingData.institutionName} - ${trainingData.courseTrack}`,
      html,
      replyTo: trainingData.email,
    }),
    dispatchEmail({
      to: trainingData.email,
      subject: `[${trainingData.registrationId}] Training Request Received | Sudabelt Medical`,
      html: userHtml,
    }),
  ]);
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
    sales: process.env.CONTACT_EMAIL || getSalesEmail(),
    biomedical_sla: process.env.CONTACT_EMAIL || getBiomedicalEmail(),
    training: process.env.CONTACT_EMAIL || getTrainingEmail(),
    general: getContactEmail(),
  };

  const targetEmail = departmentEmailMap[inquiryData.department] || getContactEmail();
  const departmentLabel = inquiryData.department.replace(/_/g, ' ').toUpperCase();

  const bodyHtml = `
    ${buildWebsiteOriginNotice({
      formName: 'Website Contact Us Form',
      pagePath: '/contact',
      actionSummary: `${inquiryData.name}${inquiryData.facilityName ? ` (${inquiryData.facilityName})` : ''} submitted a general website inquiry routed to the ${departmentLabel} desk.`,
    })}
    <p style="margin-top:0;">Please review the sender details and message below and respond directly to assist the visitor.</p>
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
    badgeText: `Sudabelt Website • Contact Desk (${departmentLabel})`,
    headerTitle: `New Website Inquiry from ${inquiryData.name}`,
    headerSubtitle: inquiryData.facilityName || inquiryData.email,
    bodyHtml,
  });

  const userBodyHtml = `
    <p style="margin-top:0;">Dear <strong>${escapeHtml(inquiryData.name)}</strong>,</p>
    <p>Thank you for reaching out to <strong>Sudabelt Medical</strong>. We have received your inquiry and routed it to our <strong>${escapeHtml(departmentLabel)}</strong> team.</p>
    <div style="background-color:#F8FAFC;border-left:4px solid #006837;padding:14px 16px;border-radius:5.5px;margin:20px 0;">
      <strong>Your Message:</strong><br />
      <span style="color:#334155;">${escapeHtml(inquiryData.message)}</span>
    </div>
    <p style="margin-bottom:0;">A member of our team will review your request and get back to you as soon as possible.</p>
  `;

  const userHtml = wrapSudabeltEmailLayout({
    badgeText: 'Inquiry Received',
    headerTitle: 'We Have Received Your Message',
    headerSubtitle: 'Sudabelt Medical Customer Desk',
    bodyHtml: userBodyHtml,
  });

  await Promise.allSettled([
    dispatchEmail({
      to: targetEmail,
      subject: `[Sudabelt Website • INQUIRY - ${departmentLabel}] ${inquiryData.name}${inquiryData.facilityName ? ` (${inquiryData.facilityName})` : ''}`,
      html,
      replyTo: inquiryData.email,
    }),
    dispatchEmail({
      to: inquiryData.email,
      subject: 'We Received Your Inquiry | Sudabelt Medical',
      html: userHtml,
    }),
  ]);
};

