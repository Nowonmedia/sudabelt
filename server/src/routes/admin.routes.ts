import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import {
  Product,
  Article,
  RFQ,
  AfterSalesTicket,
  LeadMagnet,
  TrainingRegistration,
  ContactInquiry,
  Project,
  NewsletterSubscriber,
  NewsletterCampaign,
  User,
} from '../models';
import { requireAdminAuth, requireSuperAdmin } from '../middleware/auth.middleware';
import { hashPassword } from '../utils/auth.utils';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Protect all /api/v1/admin/* endpoints
router.use(requireAdminAuth);

/**
 * POST /api/v1/admin/upload
 * Accepts base64 data or data URL for images and documents (PDFs, brochures).
 * Writes file to server/uploads and client/public/uploads, returning the relative URL.
 * Storing only the URL in the database prevents bloat and ensures fast CDN capability.
 */
router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uploadSchema = z.object({
      fileName: z.string().min(1),
      fileData: z.string().min(1),
      mimeType: z.string().optional(),
    });

    const { fileName, fileData, mimeType } = uploadSchema.parse(req.body);

    const base64Content = fileData.includes(';base64,')
      ? fileData.split(';base64,')[1]
      : fileData;

    const buffer = Buffer.from(base64Content, 'base64');
    const ext = path.extname(fileName) || (mimeType ? `.${mimeType.split('/')[1]}` : '.bin');
    const cleanBase = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${cleanBase}_${Date.now()}${ext}`;

    const serverUploadDir = path.resolve(__dirname, '../../uploads');
    const clientUploadDir = path.resolve(__dirname, '../../../client/public/uploads');

    if (!fs.existsSync(serverUploadDir)) {
      fs.mkdirSync(serverUploadDir, { recursive: true });
    }
    if (!fs.existsSync(clientUploadDir)) {
      fs.mkdirSync(clientUploadDir, { recursive: true });
    }

    fs.writeFileSync(path.join(serverUploadDir, uniqueFileName), buffer);
    fs.writeFileSync(path.join(clientUploadDir, uniqueFileName), buffer);

    const relativeUrl = `/uploads/${uniqueFileName}`;

    res.status(200).json({
      success: true,
      url: relativeUrl,
      fileName: uniqueFileName,
      sizeBytes: buffer.length,
    });
  } catch (error) {
    next(error);
  }
});

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const buildIdOrSlugFilter = (idOrSlug: string): Record<string, unknown> => {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    return { _id: idOrSlug };
  }
  return { slug: idOrSlug.toLowerCase().trim() };
};

// ============================================================================
// ZOD SCHEMAS FOR ADMIN PRODUCT & ARTICLE CRUD
// ============================================================================

const productCreateSchema = z.object({
  name: z.string({ required_error: 'Product name is required' }).trim().min(2),
  slug: z.string().trim().min(2).optional(),
  modelNumber: z.string({ required_error: 'Model number is required' }).trim().min(1),
  sku: z.string().trim().optional(),
  brand: z.string({ required_error: 'Brand is required' }).trim().min(1),
  category: z.string({ required_error: 'Category is required' }).trim().min(1),
  shortDescription: z.string({ required_error: 'Short description is required' }).trim().min(5),
  fullOverview: z.string({ required_error: 'Full overview is required' }).trim().min(10),
  specifications: z.record(z.unknown()).optional().default({}),
  keyFeatures: z
    .array(
      z.object({
        title: z.string().trim(),
        description: z.string().trim(),
      })
    )
    .optional(),
  clinicalApplications: z.array(z.string().trim()).optional(),
  complianceCertifications: z.array(z.string().trim()).optional(),
  images: z
    .object({
      primaryCutout: z.string().trim().optional(),
      contextualGallery: z.array(z.string().trim()).optional(),
      altText: z.string().trim().optional(),
    })
    .optional(),
  isConsumable: z.boolean().optional().default(false),
  datasheetUrl: z.string().trim().optional().default(''),
  pricingNotes: z.string().trim().optional(),
  compatibleProductSlugs: z.array(z.string().trim()).optional(),
  supportPackage: z
    .object({
      installationIncluded: z.boolean().optional(),
      clinicalTrainingHours: z.number().optional(),
      targetTrainees: z.array(z.string().trim()).optional(),
      preventiveMaintenanceSLA: z.string().trim().optional(),
      warrantyPeriod: z.string().trim().optional(),
      localSparePartsStocked: z.boolean().optional(),
    })
    .optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().trim(),
        answer: z.string().trim(),
      })
    )
    .optional(),
  seoMeta: z
    .object({
      metaTitle: z.string().trim().optional(),
      metaDescription: z.string().trim().optional(),
      keywords: z.array(z.string().trim()).optional(),
    })
    .optional(),
  published: z.boolean().optional().default(true),
});

const productUpdateSchema = productCreateSchema.partial();

const articleCreateSchema = z.object({
  title: z.string({ required_error: 'Article title is required' }).trim().min(3),
  slug: z.string().trim().min(2).optional(),
  type: z.enum(['blog', 'newsletter']).optional().default('newsletter'),
  issueNumber: z.coerce.number().int().positive().optional(),
  quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  category: z.string({ required_error: 'Category is required' }).trim().min(2),
  summary: z.string({ required_error: 'Summary is required' }).trim().min(5),
  content: z.string({ required_error: 'Article content is required' }).min(10),
  takeaways: z.array(z.string().trim()).optional().default([]),
  coverImage: z.string().trim().optional().default(''),
  pdfUrl: z.string().trim().optional(),
  readTimeMinutes: z.coerce.number().int().positive().optional().default(5),
  featuredProductSlugs: z.array(z.string().trim()).optional().default([]),
  publishedDate: z.coerce.date().optional(),
  published: z.boolean().optional().default(true),
});

const articleUpdateSchema = articleCreateSchema.partial();

// ============================================================================
// 1. PRODUCTS CRUD (/api/v1/admin/products)
// ============================================================================

router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, brand, published, isConsumable, search, includeDeleted } = req.query;
    const filter: Record<string, unknown> = {};

    if (includeDeleted !== 'true') {
      filter.isDeleted = { $ne: true };
    }
    if (typeof category === 'string' && category.trim()) {
      filter.category = category.trim();
    }
    if (typeof brand === 'string' && brand.trim()) {
      filter.brand = brand.trim();
    }
    if (published === 'true' || published === 'false') {
      filter.published = published === 'true';
    }
    if (isConsumable === 'true' || isConsumable === 'false') {
      filter.isConsumable = isConsumable === 'true';
    }
    if (typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { modelNumber: regex },
        { brand: regex },
        { shortDescription: regex },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean().exec();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = productCreateSchema.parse(req.body);
    const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.name);

    const createdProduct = await Product.create({
      ...parsed,
      slug,
      isDeleted: false,
    });

    res.status(201).json({
      success: true,
      data: createdProduct,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idOrSlug = String(req.params.id);
    const updates = productUpdateSchema.parse(req.body);
    if (updates.slug) {
      updates.slug = slugify(updates.slug);
    }

    const updatedProduct = await Product.findOneAndUpdate(
      buildIdOrSlugFilter(idOrSlug),
      { $set: updates },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    if (!updatedProduct) {
      throw new AppError(`Product not found for identifier: ${idOrSlug}`, 404);
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idOrSlug = String(req.params.id);
    const isSoftDelete = req.query.soft === 'true';
    const filter = buildIdOrSlugFilter(idOrSlug);

    if (isSoftDelete) {
      const softDeleted = await Product.findOneAndUpdate(
        filter,
        { $set: { published: false, isDeleted: true } },
        { new: true }
      )
        .lean()
        .exec();

      if (!softDeleted) {
        throw new AppError(`Product not found for identifier: ${idOrSlug}`, 404);
      }

      res.status(200).json({
        success: true,
        message: 'Product unpublished and soft-deleted.',
        data: softDeleted,
      });
      return;
    }

    const deletedProduct = await Product.findOneAndDelete(filter).lean().exec();
    if (!deletedProduct) {
      throw new AppError(`Product not found for identifier: ${idOrSlug}`, 404);
    }

    res.status(200).json({
      success: true,
      message: 'Product permanently deleted.',
      data: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// 2. ARTICLES & NEWSLETTERS CRUD (/api/v1/admin/articles)
// ============================================================================

router.get('/articles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, category, year, published, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof type === 'string' && (type === 'blog' || type === 'newsletter')) {
      filter.type = type;
    }
    if (typeof category === 'string' && category.trim()) {
      filter.category = category.trim();
    }
    if (typeof year === 'string' && !Number.isNaN(Number(year))) {
      filter.year = Number(year);
    }
    if (published === 'true' || published === 'false') {
      filter.published = published === 'true';
    }
    if (typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { summary: regex }, { category: regex }];
    }

    const articles = await Article.find(filter).sort({ publishedDate: -1, createdAt: -1 }).lean().exec();

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/articles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = articleCreateSchema.parse(req.body);
    const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.title);
    const pubDate = parsed.publishedDate || new Date();
    const year = parsed.year || pubDate.getFullYear();

    const createdArticle = await Article.create({
      ...parsed,
      slug,
      publishedDate: pubDate,
      year,
    });

    res.status(201).json({
      success: true,
      data: createdArticle,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/articles/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idOrSlug = String(req.params.id);
    const updates = articleUpdateSchema.parse(req.body);
    if (updates.slug) {
      updates.slug = slugify(updates.slug);
    }

    const updatedArticle = await Article.findOneAndUpdate(
      buildIdOrSlugFilter(idOrSlug),
      { $set: updates },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    if (!updatedArticle) {
      throw new AppError(`Article not found for identifier: ${idOrSlug}`, 404);
    }

    res.status(200).json({
      success: true,
      data: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/articles/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idOrSlug = String(req.params.id);
    const deletedArticle = await Article.findOneAndDelete(buildIdOrSlugFilter(idOrSlug))
      .lean()
      .exec();

    if (!deletedArticle) {
      throw new AppError(`Article not found for identifier: ${idOrSlug}`, 404);
    }

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully.',
      data: deletedArticle,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// 3. LEAD & TICKET VIEWER (/api/v1/admin/rfqs, /support-tickets, /leads)
// ============================================================================

router.get('/rfqs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, urgency, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof status === 'string' && ['pending', 'quoted', 'closed'].includes(status)) {
      filter.status = status;
    }
    if (typeof urgency === 'string' && urgency.trim()) {
      filter.urgency = urgency.trim();
    }
    if (typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { referenceId: regex },
        { facilityName: regex },
        { 'contact.name': regex },
        { 'contact.email': regex },
      ];
    }

    const rfqs = await RFQ.find(filter).sort({ createdAt: -1 }).lean().exec();

    res.status(200).json({
      success: true,
      count: rfqs.length,
      data: rfqs,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/rfqs/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = z
      .object({ status: z.enum(['pending', 'quoted', 'closed']) })
      .parse(req.body);
    const idOrRef = String(req.params.id);
    const filter = mongoose.Types.ObjectId.isValid(idOrRef)
      ? { _id: idOrRef }
      : { referenceId: idOrRef };

    const updated = await RFQ.findOneAndUpdate(filter, { $set: { status } }, { new: true })
      .lean()
      .exec();

    if (!updated) {
      throw new AppError(`RFQ not found for identifier: ${idOrRef}`, 404);
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/support-tickets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, urgencyLevel, issueType, type } = req.query;
    const filter: Record<string, unknown> = {};

    if (
      typeof status === 'string' &&
      [
        'open',
        'dispatched',
        'in_progress',
        'resolved',
        'closed',
        'new',
        'responded',
        'archived',
        'confirmed',
        'completed',
        'cancelled',
      ].includes(status)
    ) {
      filter.status = status;
    }
    if (
      typeof urgencyLevel === 'string' &&
      ['critical_patient_impact', 'moderate', 'routine'].includes(urgencyLevel)
    ) {
      filter.urgencyLevel = urgencyLevel;
    }
    if (
      typeof issueType === 'string' &&
      ['breakdown', 'preventive_maintenance', 'calibration', 'consumable_stockout'].includes(
        issueType
      )
    ) {
      filter.issueType = issueType;
    }

    const requestedType = typeof type === 'string' ? type.toLowerCase() : 'all';
    const allTickets: Array<Record<string, unknown>> = [];

    if (
      requestedType === 'all' ||
      requestedType === 'after_sales' ||
      requestedType === 'breakdown'
    ) {
      const tickets = await AfterSalesTicket.find(filter).sort({ createdAt: -1 }).lean().exec();
      const mapped = tickets.map((t) => ({
        ...t,
        ticketType: 'after_sales',
        displayType: t.issueType === 'breakdown' ? 'Emergency Breakdown' : 'After-Sales Service',
        unifiedId: t.ticketId || String(t._id),
      }));
      allTickets.push(...mapped);
    }

    if (requestedType === 'all' || requestedType === 'training') {
      const trainings = await TrainingRegistration.find({}).sort({ createdAt: -1 }).lean().exec();
      const mapped = trainings.map((tr) => ({
        ...tr,
        ticketType: 'training',
        displayType: 'Clinical Training Booking',
        unifiedId: tr.registrationId || String(tr._id),
        facilityName: tr.institutionName,
        contactPerson: tr.contactName,
        urgencyLevel: 'routine',
        description: `Track: ${tr.courseTrack} | ${tr.numberOfTrainees} Trainees in ${tr.targetHospitalState}`,
      }));
      allTickets.push(...mapped);
    }

    if (requestedType === 'all' || requestedType === 'contact') {
      const inquiries = await ContactInquiry.find({}).sort({ createdAt: -1 }).lean().exec();
      const mapped = inquiries.map((inq) => ({
        ...inq,
        ticketType: 'contact',
        displayType: `Contact Inquiry (${inq.department})`,
        unifiedId: `SBM-INQ-${String(inq._id).slice(-6)}`,
        contactPerson: inq.name,
        urgencyLevel: 'routine',
        description: inq.message,
      }));
      allTickets.push(...mapped);
    }

    allTickets.sort(
      (a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime()
    );

    res.status(200).json({
      success: true,
      count: allTickets.length,
      data: allTickets,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/support-tickets/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = z
      .object({
        status: z.string().min(1),
      })
      .parse(req.body);
    const idOrTicket = String(req.params.id);
    const filter = mongoose.Types.ObjectId.isValid(idOrTicket)
      ? { _id: idOrTicket }
      : { ticketId: idOrTicket };

    let updated: any = await AfterSalesTicket.findOneAndUpdate(
      filter,
      { $set: { status } },
      { new: true }
    )
      .lean()
      .exec();

    if (!updated) {
      const trainingFilter = mongoose.Types.ObjectId.isValid(idOrTicket)
        ? { _id: idOrTicket }
        : { registrationId: idOrTicket };
      updated = await TrainingRegistration.findOneAndUpdate(
        trainingFilter,
        { $set: { status } },
        { new: true }
      )
        .lean()
        .exec();
    }

    if (!updated) {
      const cleanId = idOrTicket.replace('SBM-INQ-', '');
      const inqFilter = mongoose.Types.ObjectId.isValid(cleanId)
        ? { _id: cleanId }
        : { _id: idOrTicket };
      updated = await ContactInquiry.findOneAndUpdate(
        inqFilter,
        { $set: { status } },
        { new: true }
      )
        .lean()
        .exec();
    }

    if (!updated) {
      throw new AppError(`Inquiry/ticket not found for identifier: ${idOrTicket}`, 404);
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/leads', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assetSlug, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof assetSlug === 'string' && assetSlug.trim()) {
      filter.downloadedAssetSlug = assetSlug.trim();
    }
    if (typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { workEmail: regex }, { facilityName: regex }];
    }

    const leads = await LeadMagnet.find(filter).sort({ downloadedAt: -1 }).lean().exec();

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/training-registrations', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const registrations = await TrainingRegistration.find().sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// PROJECTS CRUD ENDPOINTS
// ============================================================================

const projectCreateSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).trim().min(3),
  slug: z.string().trim().optional(),
  category: z.string({ required_error: 'Category is required' }).trim().min(2),
  facilityName: z.string({ required_error: 'Facility name is required' }).trim().min(2),
  locationState: z.string({ required_error: 'Location state is required' }).trim().min(2),
  city: z.string().trim().optional(),
  completionYear: z.coerce.number().min(2015).max(2035).default(2023),
  isFeatured: z.boolean().optional().default(false),
  heroImage: z.string({ required_error: 'Hero image is required' }).trim(),
  galleryImages: z.array(z.string().trim()).optional().default([]),
  shortDescription: z.string({ required_error: 'Short description is required' }).trim().min(5),
  fullDescription: z.string({ required_error: 'Full description is required' }).trim().min(10),
  clientOrCommissionedBy: z.string().trim().optional(),
  scopeOfWork: z.array(z.string().trim()).optional().default([]),
  equipmentSupplied: z.array(z.string().trim()).optional().default([]),
  impactMetrics: z
    .array(
      z.object({
        label: z.string().trim(),
        value: z.string().trim(),
      })
    )
    .optional()
    .default([]),
  published: z.boolean().optional().default(true),
});

const projectUpdateSchema = projectCreateSchema.partial();

router.get('/projects', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find({ isDeleted: { $ne: true } })
      .sort({ completionYear: -1, createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = projectCreateSchema.parse(req.body);
    const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.title);

    const existing = await Project.findOne({ slug }).lean().exec();
    if (existing) {
      throw new AppError(`Project with slug '${slug}' already exists.`, 409);
    }

    const created = await Project.create({
      ...parsed,
      slug,
      isDeleted: false,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: created,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const parsed = projectUpdateSchema.parse(req.body);

    const updatePayload: Record<string, unknown> = { ...parsed };
    if (parsed.slug) {
      updatePayload.slug = slugify(parsed.slug);
    } else if (parsed.title) {
      updatePayload.slug = slugify(parsed.title);
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new AppError(`Project not found with id: ${id}`, 404);
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const deleted = await Project.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, published: false } },
      { new: true }
    );

    if (!deleted) {
      throw new AppError(`Project not found with id: ${id}`, 404);
    }

    res.status(200).json({
      success: true,
      message: 'Project marked as deleted.',
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// NEWSLETTER CRUD ENDPOINTS
// ============================================================================

router.get('/newsletter/subscribers', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const subscribers = await NewsletterSubscriber.find()
      .sort({ subscribedAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/newsletter/subscribers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({
      email: z.string().trim().email(),
      name: z.string().trim().optional(),
      institution: z.string().trim().optional(),
      source: z.string().trim().optional().default('admin_manual'),
    });

    const parsed = schema.parse(req.body);
    const existing = await NewsletterSubscriber.findOne({ email: parsed.email.toLowerCase() })
      .lean()
      .exec();

    if (existing) {
      throw new AppError('Subscriber email already registered.', 409);
    }

    const created = await NewsletterSubscriber.create({
      ...parsed,
      email: parsed.email.toLowerCase(),
      isActive: true,
      subscribedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Subscriber added successfully.',
      data: created,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/newsletter/subscribers/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await NewsletterSubscriber.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Subscriber removed successfully.',
    });
  } catch (error) {
    next(error);
  }
});

const campaignSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().optional(),
  subject: z.string().trim().min(3),
  issueNumber: z.coerce.number().min(1),
  quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']).optional(),
  year: z.coerce.number().min(2020).max(2035).default(2026),
  summary: z.string().trim().min(5),
  content: z.string().trim().min(10),
  coverImage: z.string().trim().optional(),
  pdfUrl: z.string().trim().optional(),
  status: z.enum(['draft', 'scheduled', 'sent']).default('draft'),
  published: z.boolean().optional().default(false),
});

router.get('/newsletter/campaigns', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const campaigns = await NewsletterCampaign.find()
      .sort({ issueNumber: -1, createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/newsletter/campaigns', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = campaignSchema.parse(req.body);
    const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.title);

    const created = await NewsletterCampaign.create({
      ...parsed,
      slug,
    });

    res.status(201).json({
      success: true,
      message: 'Newsletter campaign draft created.',
      data: created,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/newsletter/campaigns/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const parsed = campaignSchema.partial().parse(req.body);

    const updated = await NewsletterCampaign.findByIdAndUpdate(
      id,
      { $set: parsed },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new AppError(`Campaign not found with id: ${id}`, 404);
    }

    res.status(200).json({
      success: true,
      message: 'Newsletter campaign updated.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/newsletter/campaigns/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await NewsletterCampaign.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/newsletter/campaigns/:id/send', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const activeSubscribers = await NewsletterSubscriber.find({ isActive: true }).lean().exec();

    const updated = await NewsletterCampaign.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'sent',
          published: true,
          sentAt: new Date(),
          recipientCount: activeSubscribers.length,
        },
      },
      { new: true }
    );

    if (!updated) {
      throw new AppError(`Campaign not found with id: ${id}`, 404);
    }

    res.status(200).json({
      success: true,
      message: `Newsletter broadcast dispatched to ${activeSubscribers.length} active subscribers.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// ADMIN USER MANAGEMENT (SUPER ADMIN ONLY)
// ============================================================================

const adminUserCreateSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(2),
  email: z.string({ required_error: 'Email is required' }).trim().email().toLowerCase(),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
  role: z.enum(['superadmin', 'admin', 'editor'], { required_error: 'Role is required' }),
});

const adminUserUpdateSchema = z.object({
  name: z.string().trim().min(2).optional(),
  role: z.enum(['superadmin', 'admin', 'editor']).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

router.get('/users', requireSuperAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/users', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = adminUserCreateSchema.parse(req.body);

    const existing = await User.findOne({ email: parsed.email }).lean().exec();
    if (existing) {
      throw new AppError(`Administrator with email '${parsed.email}' already exists.`, 409);
    }

    const passwordHash = hashPassword(parsed.password);

    const created = await User.create({
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: parsed.role,
      isActive: true,
    });

    const safeUser = {
      _id: (created as any)._id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      isActive: true,
      createdAt: new Date(),
    };

    res.status(201).json({
      success: true,
      message: `New ${parsed.role} account created successfully.`,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/users/:id', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const parsed = adminUserUpdateSchema.parse(req.body);

    const patchPayload: Record<string, unknown> = {};
    if (parsed.name) patchPayload.name = parsed.name;
    if (parsed.role) patchPayload.role = parsed.role;
    if (parsed.isActive !== undefined) patchPayload.isActive = parsed.isActive;
    if (parsed.password) patchPayload.passwordHash = hashPassword(parsed.password);

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: patchPayload },
      { new: true }
    );

    if (!updated) {
      throw new AppError(`Admin user not found with id: ${id}`, 404);
    }

    const safeUpdated = {
      _id: (updated as any)._id,
      name: (updated as any).name,
      email: (updated as any).email,
      role: (updated as any).role,
      isActive: (updated as any).isActive,
      updatedAt: new Date(),
    };

    res.status(200).json({
      success: true,
      message: 'Admin user updated successfully.',
      data: safeUpdated,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    // Prevent deleting own account
    if (req.adminUser && req.adminUser.id === id) {
      throw new AppError('Security violation: You cannot delete your own administrator account.', 400);
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Administrator account removed successfully.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
