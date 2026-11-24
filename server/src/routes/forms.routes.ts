import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  RFQ,
  TrainingRegistration,
  AfterSalesTicket,
  ContactInquiry,
  LeadMagnet,
  Product,
} from '../models';
import {
  sendRFQConfirmation,
  sendTrainingBookingAlert,
  sendSupportTicketAlert,
  sendContactInquiryAlert,
  sendLeadMagnetWelcome,
} from '../services/emailService';
import { createRateLimiter } from '../middleware/rateLimiter';

const router = Router();

const publicFormRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxRequests: 30,
  message: 'Submission rate limit reached. Please wait a few minutes or contact us via WhatsApp.',
});

router.use(publicFormRateLimiter);

const getWhatsAppNumber = (desk: 'sales' | 'biomedical' = 'sales'): string => {
  if (desk === 'biomedical') {
    return process.env.WHATSAPP_BIOMEDICAL_NUMBER || process.env.WHATSAPP_SALES_NUMBER || '234XXXXXXXXXX';
  }
  return process.env.WHATSAPP_SALES_NUMBER || '234XXXXXXXXXX';
};

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

const rfqItemSchema = z.object({
  equipmentId: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  name: z.string({ required_error: 'Item name is required' }).trim().min(2, 'Item name cannot be empty'),
  category: z.string().trim().optional(),
  quantity: z
    .number({ required_error: 'Quantity is required', invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  notes: z.string().trim().optional(),
});

const rfqSubmissionSchema = z.object({
  facilityName: z
    .string({ required_error: 'Facility name is required' })
    .trim()
    .min(2, 'Facility name must be at least 2 characters'),
  facilityType: z
    .string({ required_error: 'Facility type is required' })
    .trim()
    .min(2, 'Facility type is required'),
  location: z.object({
    city: z.string({ required_error: 'City is required' }).trim().min(2, 'City is required'),
    state: z.string({ required_error: 'State is required' }).trim().min(2, 'State is required'),
    country: z.string().trim().optional().default('Nigeria'),
  }),
  urgency: z
    .string({ required_error: 'Urgency timeline is required' })
    .trim()
    .min(2, 'Urgency timeline is required'),
  selectedItems: z
    .array(rfqItemSchema, { required_error: 'Selected items list is required' })
    .min(1, 'At least one equipment or consumable item must be selected'),
  slaTier: z
    .string()
    .trim()
    .optional()
    .default('Standard Turnkey + 12-Month Preventive SLA'),
  contact: z.object({
    name: z.string({ required_error: 'Contact name is required' }).trim().min(2, 'Contact name is required'),
    role: z.string({ required_error: 'Contact role is required' }).trim().min(2, 'Contact role is required'),
    email: z.string({ required_error: 'Contact email is required' }).trim().email('Invalid email address'),
    phone: z.string({ required_error: 'Contact phone is required' }).trim().min(7, 'Valid phone number is required'),
  }),
  tenderAttachmentUrl: z.string().trim().url('Tender attachment must be a valid URL').optional().or(z.literal('')),
  additionalNotes: z.string().trim().optional(),
});

const trainingBookingSchema = z.object({
  institutionName: z
    .string({ required_error: 'Institution name is required' })
    .trim()
    .min(2, 'Institution name is required'),
  courseTrack: z
    .string({ required_error: 'Course track is required' })
    .trim()
    .min(2, 'Course track is required'),
  numberOfTrainees: z.coerce
    .number({ required_error: 'Number of trainees is required' })
    .int('Number of trainees must be an integer')
    .min(1, 'At least 1 trainee is required'),
  targetHospitalState: z
    .string({ required_error: 'Target hospital state is required' })
    .trim()
    .min(2, 'Target hospital state is required'),
  contactName: z
    .string({ required_error: 'Contact name is required' })
    .trim()
    .min(2, 'Contact name is required'),
  contactRole: z
    .string({ required_error: 'Contact role is required' })
    .trim()
    .min(2, 'Contact role is required'),
  email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
  phone: z.string({ required_error: 'Phone number is required' }).trim().min(7, 'Valid phone number is required'),
  preferredDates: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

const afterSalesSupportSchema = z.object({
  hospitalName: z
    .string({ required_error: 'Hospital name is required' })
    .trim()
    .min(2, 'Hospital name is required'),
  equipmentModel: z
    .string({ required_error: 'Equipment model is required' })
    .trim()
    .min(2, 'Equipment model is required'),
  serialNumber: z
    .string({ required_error: 'Equipment serial number is required' })
    .trim()
    .min(2, 'Serial number is required'),
  issueType: z.enum(
    ['breakdown', 'preventive_maintenance', 'calibration', 'consumable_stockout'],
    {
      errorMap: () => ({
        message:
          "Issue type must be one of: 'breakdown', 'preventive_maintenance', 'calibration', or 'consumable_stockout'",
      }),
    }
  ),
  urgencyLevel: z.enum(['critical_patient_impact', 'moderate', 'routine'], {
    errorMap: () => ({
      message: "Urgency level must be one of: 'critical_patient_impact', 'moderate', or 'routine'",
    }),
  }),
  description: z
    .string({ required_error: 'Fault description is required' })
    .trim()
    .min(5, 'Please provide a brief description of the issue (at least 5 characters)'),
  contactName: z
    .string({ required_error: 'Contact name is required' })
    .trim()
    .min(2, 'Contact name is required'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string({ required_error: 'Phone number is required' }).trim().min(7, 'Valid phone number is required'),
  locationState: z.string().trim().optional(),
});

const contactInquirySchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(2, 'Name is required'),
  email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
  phone: z.string({ required_error: 'Phone number is required' }).trim().min(7, 'Valid phone number is required'),
  facilityName: z.string().trim().optional(),
  department: z
    .enum(['sales', 'biomedical_sla', 'training', 'general'], {
      errorMap: () => ({
        message: "Department must be one of: 'sales', 'biomedical_sla', 'training', or 'general'",
      }),
    })
    .default('general'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(5, 'Message must be at least 5 characters'),
});

const leadCaptureSchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }).trim().min(2, 'Name is required'),
    workEmail: z
      .string({ required_error: 'Work email is required' })
      .trim()
      .email('Valid work email is required'),
    phone: z.string().trim().optional(),
    facilityName: z
      .string({ required_error: 'Facility name is required' })
      .trim()
      .min(2, 'Facility name is required'),
    assetSlug: z.string().trim().min(2, 'Asset slug is required').optional(),
    downloadedAssetSlug: z.string().trim().min(2).optional(),
    assetTitle: z.string().trim().optional(),
    assetUrl: z.string().trim().optional(),
    leadSource: z.string().trim().optional(),
  })
  .refine((data) => Boolean(data.assetSlug || data.downloadedAssetSlug), {
    message: 'assetSlug is required',
    path: ['assetSlug'],
  });

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

/**
 * 1. POST /api/v1/rfq
 * Validates RFQ submission, saves to MongoDB, triggers Resend confirmation emails,
 * and returns a pre-populated WhatsApp Business link.
 */
router.post('/rfq', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = rfqSubmissionSchema.parse(req.body);
    const referenceId = `SBM-RFQ-${Date.now().toString().slice(-6)}`;

    const rfqRecord = await RFQ.create({
      ...validatedData,
      referenceId,
      tenderAttachmentUrl: validatedData.tenderAttachmentUrl || undefined,
      status: 'pending',
    });

    // Fire email notifications asynchronously without blocking response if Resend is slow
    await sendRFQConfirmation(rfqRecord).catch((err) => {
      console.error('[RFQ Route] Non-fatal email notification error:', err);
    });

    const itemsSummary = validatedData.selectedItems
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(', ');

    const waPhone = getWhatsAppNumber('sales');
    const waMessage = `Hello Sudabelt Sales, I have submitted RFQ ${referenceId} for ${validatedData.facilityName} covering ${itemsSummary}`;
    const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;

    res.status(201).json({
      success: true,
      referenceId,
      whatsappUrl,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 2. POST /api/v1/training-booking
 * Validates clinical/biomedical training booking, stores in TrainingRegistration,
 * and alerts the Training Coordinator via Resend.
 */
router.post('/training-booking', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = trainingBookingSchema.parse(req.body);
    const registrationId = `SBM-TRN-${Date.now().toString().slice(-6)}`;

    const trainingRecord = await TrainingRegistration.create({
      ...validatedData,
      registrationId,
      status: 'pending',
    });

    await sendTrainingBookingAlert(trainingRecord).catch((err) => {
      console.error('[Training Route] Non-fatal email notification error:', err);
    });

    const waPhone = getWhatsAppNumber('sales');
    const waText = `Hello Sudabelt Training Hub, I have registered ${validatedData.numberOfTrainees} trainees from ${validatedData.institutionName} (${validatedData.targetHospitalState}) for ${validatedData.courseTrack} (Ref: ${registrationId}).`;
    const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;

    res.status(201).json({
      success: true,
      registrationId,
      message: 'Training cohort registration received successfully.',
      whatsappUrl,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 3. POST /api/v1/after-sales-support
 * Generates ticket ID SBM-SRV-XXXXXX, saves to AfterSalesTicket,
 * dispatches urgent biomedical alert, and returns whatsappUrgentUrl.
 */
router.post('/after-sales-support', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = afterSalesSupportSchema.parse(req.body);
    const ticketId = `SBM-SRV-${Date.now().toString().slice(-6)}`;

    const ticketRecord = await AfterSalesTicket.create({
      ...validatedData,
      email: validatedData.email || undefined,
      ticketId,
      status: 'open',
    });

    await sendSupportTicketAlert(ticketRecord).catch((err) => {
      console.error('[AfterSales Route] Non-fatal email notification error:', err);
    });

    const waPhone = getWhatsAppNumber('biomedical');
    const urgentPrefix =
      validatedData.urgencyLevel === 'critical_patient_impact' ? '[CRITICAL PATIENT IMPACT] ' : '';
    const waText = `${urgentPrefix}Hello Sudabelt Biomedical Desk, I have logged support ticket ${ticketId} for ${validatedData.hospitalName}. Equipment: ${validatedData.equipmentModel} (S/N: ${validatedData.serialNumber}) — Issue: ${validatedData.issueType.replace(/_/g, ' ')}.`;
    const whatsappUrgentUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;

    res.status(201).json({
      success: true,
      ticketId,
      whatsappUrgentUrl,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 4. POST /api/v1/contact
 * Validates general/departmental inquiry, saves to ContactInquiry,
 * and dispatches department routing alert.
 */
router.post('/contact', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = contactInquirySchema.parse(req.body);

    const inquiryRecord = await ContactInquiry.create({
      ...validatedData,
      status: 'new',
    });

    await sendContactInquiryAlert(inquiryRecord).catch((err) => {
      console.error('[Contact Route] Non-fatal email notification error:', err);
    });

    res.status(201).json({
      success: true,
      inquiryId: inquiryRecord._id,
      message: 'Your inquiry has been received and routed to the appropriate Sudabelt department.',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 5. POST /api/v1/lead-capture
 * Validates gated datasheet request, stores lead in LeadMagnet collection,
 * emails the PDF link via Resend, and returns { downloadUrl }.
 */
router.post('/lead-capture', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = leadCaptureSchema.parse(req.body);
    const resolvedSlug = (validatedData.assetSlug || validatedData.downloadedAssetSlug || '').trim();

    // Check if there is a matching product in MongoDB with a custom datasheetUrl
    let downloadUrl =
      validatedData.assetUrl || `/docs/datasheets/sudabelt-${resolvedSlug}-datasheet.pdf`;
    let assetTitle = validatedData.assetTitle;

    const matchingProduct = await Product.findOne({ slug: resolvedSlug }).lean().exec().catch(() => null);
    if (matchingProduct) {
      if (matchingProduct.datasheetUrl) {
        downloadUrl = matchingProduct.datasheetUrl;
      }
      if (!assetTitle) {
        assetTitle = matchingProduct.name;
      }
    }

    let resolvedSource = validatedData.leadSource?.trim();
    if (!resolvedSource) {
      const slugLower = resolvedSlug.toLowerCase();
      if (slugLower.includes('profile') || slugLower.includes('handbook')) {
        resolvedSource = 'Company Handbook';
      } else if (matchingProduct) {
        resolvedSource = 'Product Datasheet';
      } else if (slugLower.includes('newsletter')) {
        resolvedSource = 'Newsletter';
      } else {
        resolvedSource = 'Technical Document';
      }
    }

    const leadRecord = await LeadMagnet.create({
      name: validatedData.name,
      workEmail: validatedData.workEmail,
      phone: validatedData.phone,
      facilityName: validatedData.facilityName,
      downloadedAssetSlug: resolvedSlug,
      downloadedAssetTitle: assetTitle,
      downloadedAssetUrl: downloadUrl,
      leadSource: resolvedSource,
      downloadedAt: new Date(),
    });

    await sendLeadMagnetWelcome(leadRecord).catch((err) => {
      console.error('[LeadCapture Route] Non-fatal email notification error:', err);
    });

    res.status(201).json({
      success: true,
      downloadUrl,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
