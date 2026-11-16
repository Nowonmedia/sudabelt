import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import {
  Product,
  Article,
  RFQ,
  AfterSalesTicket,
  LeadMagnet,
  TrainingRegistration,
  ContactInquiry,
} from '../models';
import { requireAdminAuth } from '../middleware/auth.middleware';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Protect all /api/v1/admin/* endpoints
router.use(requireAdminAuth);

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
    const { status, urgencyLevel, issueType } = req.query;
    const filter: Record<string, unknown> = {};

    if (
      typeof status === 'string' &&
      ['open', 'dispatched', 'in_progress', 'resolved', 'closed'].includes(status)
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

    const tickets = await AfterSalesTicket.find(filter).sort({ createdAt: -1 }).lean().exec();

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/support-tickets/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = z
      .object({
        status: z.enum(['open', 'dispatched', 'in_progress', 'resolved', 'closed']),
      })
      .parse(req.body);
    const idOrTicket = String(req.params.id);
    const filter = mongoose.Types.ObjectId.isValid(idOrTicket)
      ? { _id: idOrTicket }
      : { ticketId: idOrTicket };

    const updated = await AfterSalesTicket.findOneAndUpdate(
      filter,
      { $set: { status } },
      { new: true }
    )
      .lean()
      .exec();

    if (!updated) {
      throw new AppError(`Support ticket not found for identifier: ${idOrTicket}`, 404);
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

router.get('/contact-inquiries', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
