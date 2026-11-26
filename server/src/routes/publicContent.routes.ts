import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Product, Article, Project, NewsletterSubscriber, NewsletterCampaign } from '../models';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Add short edge/browser caching to read-only public catalog GET endpoints to reduce repeat API latency
router.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' && !req.path.endsWith('/datasheet') && !req.path.endsWith('/pdf')) {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  }
  next();
});

/**
 * GET /api/v1/products
 * Returns all published products with category, brand, consumable type, and search filters.
 */
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, brand, oem, isConsumable, productType, search } = req.query;
    const filter: Record<string, unknown> = {
      published: true,
      isDeleted: { $ne: true },
    };

    if (typeof category === 'string' && category.trim() && category.trim().toLowerCase() !== 'all') {
      filter.category = category.trim();
    }
    const brandParam = typeof brand === 'string' && brand.trim() ? brand.trim() : typeof oem === 'string' && oem.trim() ? oem.trim() : '';
    if (brandParam && brandParam.toLowerCase() !== 'all') {
      filter.brand = new RegExp(`^${brandParam}$`, 'i');
    }
    if (isConsumable === 'true' || isConsumable === 'false') {
      filter.isConsumable = isConsumable === 'true';
    } else if (typeof productType === 'string' && productType.trim()) {
      const pt = productType.trim().toLowerCase();
      if (pt === 'consumable' || pt === 'consumables') {
        filter.isConsumable = true;
      } else if (pt === 'technology' || pt === 'technologies') {
        filter.isConsumable = false;
      }
    }
    if (typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { modelNumber: regex },
        { brand: regex },
        { categoryLabel: regex },
        { shortDescription: regex },
        { fullOverview: regex },
      ];
    }

    const products = await Product.find(filter).sort({ isConsumable: 1, createdAt: -1 }).lean().exec();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/products/:slug
 * Returns individual published product details by slug, SKU, or database ID,
 * along with populated compatible consumables/products.
 */
router.get('/products/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawParam = String(req.params.slug).trim();
    const queryConditions: Record<string, unknown>[] = [
      { slug: rawParam.toLowerCase() },
      { sku: rawParam },
    ];

    if (mongoose.Types.ObjectId.isValid(rawParam)) {
      queryConditions.push({ _id: rawParam });
    }

    const product = await Product.findOne({
      $or: queryConditions,
      published: true,
      isDeleted: { $ne: true },
    })
      .lean()
      .exec();

    if (!product) {
      throw new AppError(`Product not found for: ${rawParam}`, 404);
    }

    // Fetch available consumables in the same category for the product detail page
    let availableConsumables: unknown[] = [];
    if (!product.isConsumable) {
      availableConsumables = await Product.find({
        category: product.category,
        isConsumable: true,
        published: true,
        isDeleted: { $ne: true },
      })
        .lean()
        .exec();
    }

    res.status(200).json({
      success: true,
      data: {
        ...product,
        availableConsumables,
        compatibleConsumables: availableConsumables,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Helper to generate a valid PDF 1.4 binary buffer from exact Milanote product fields
 */
function escapePdfText(str: string): string {
  return str
    .replace(/[^\x20-\x7E]/g, (ch) => {
      if (ch === '™') return '(TM)';
      if (ch === '®') return '(R)';
      if (ch === '©') return '(C)';
      if (ch === '°') return ' deg';
      if (ch === '²') return '2';
      return '-';
    })
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapTextLines(text: string, maxChars = 88): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if (!current) {
      current = w;
    } else if (current.length + 1 + w.length <= maxChars) {
      current += ' ' + w;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildProductPdfBuffer(product: Record<string, unknown>): Buffer {
  interface PdfLine {
    text: string;
    bold?: boolean;
    size?: number;
    gapBefore?: number;
  }
  const allLines: PdfLine[] = [];

  allLines.push({ text: 'SUDABELT MEDICAL - PRODUCT INFORMATION', bold: true, size: 10 });
  allLines.push({ text: String(product.name || ''), bold: true, size: 16, gapBefore: 6 });
  const metaParts = [product.brand, product.categoryLabel || product.category].filter(Boolean);
  if (metaParts.length > 0) {
    allLines.push({ text: metaParts.join(' | '), bold: true, size: 10, gapBefore: 4 });
  }

  const summary = String(product.fullOverview || product.shortDescription || '').trim();
  if (summary) {
    allLines.push({ text: 'SUMMARY', bold: true, size: 11, gapBefore: 10 });
    for (const l of wrapTextLines(summary, 86)) {
      allLines.push({ text: l, size: 10 });
    }
  }

  const features = Array.isArray(product.productFeatures) ? (product.productFeatures as string[]) : [];
  if (features.length > 0) {
    allLines.push({ text: 'PRODUCT FEATURES', bold: true, size: 11, gapBefore: 10 });
    for (const f of features) {
      const wrapped = wrapTextLines(`- ${f}`, 86);
      wrapped.forEach((l, idx) => allLines.push({ text: idx === 0 ? l : `  ${l}`, size: 9.5 }));
    }
  }

  const uses = Array.isArray(product.commonUses) ? (product.commonUses as string[]) : [];
  if (uses.length > 0) {
    allLines.push({ text: 'COMMON USES', bold: true, size: 11, gapBefore: 10 });
    for (const u of uses) {
      const wrapped = wrapTextLines(`- ${u}`, 86);
      wrapped.forEach((l, idx) => allLines.push({ text: idx === 0 ? l : `  ${l}`, size: 9.5 }));
    }
  }

  const usps = String(product.usps || '').trim();
  if (usps) {
    allLines.push({ text: 'UNIQUE SELLING POINT', bold: true, size: 11, gapBefore: 10 });
    for (const l of wrapTextLines(usps, 86)) {
      allLines.push({ text: l, size: 9.5 });
    }
  }

  const otherInfo = Array.isArray(product.otherInformation) ? (product.otherInformation as string[]) : [];
  if (otherInfo.length > 0) {
    allLines.push({ text: 'OTHER INFORMATION', bold: true, size: 11, gapBefore: 10 });
    for (const info of otherInfo) {
      const wrapped = wrapTextLines(`- ${info}`, 86);
      wrapped.forEach((l, idx) => allLines.push({ text: idx === 0 ? l : `  ${l}`, size: 9.5 }));
    }
  }

  const faqs = Array.isArray(product.faqs)
    ? (product.faqs as { question: string; answer: string }[])
    : [];
  if (faqs.length > 0) {
    allLines.push({ text: 'FAQS', bold: true, size: 11, gapBefore: 10 });
    for (const faq of faqs) {
      for (const ql of wrapTextLines(`Q: ${faq.question}`, 84)) {
        allLines.push({ text: ql, bold: true, size: 9.5, gapBefore: 3 });
      }
      for (const al of wrapTextLines(`A: ${faq.answer}`, 86)) {
        allLines.push({ text: al, size: 9.5 });
      }
    }
  }

  // Paginate into pages of height 792pt (top margin 745, bottom margin 50)
  const pages: string[] = [];
  let currentOps: string[] = [];
  let y = 745;

  for (const item of allLines) {
    const fontSize = item.size || 10;
    const lineHeight = fontSize + 4;
    const needed = (item.gapBefore || 0) + lineHeight;
    if (y - needed < 50 && currentOps.length > 0) {
      pages.push(currentOps.join('\n'));
      currentOps = [];
      y = 745;
    }
    y -= item.gapBefore || 0;
    const fontRef = item.bold ? '/F2' : '/F1';
    currentOps.push(`BT ${fontRef} ${fontSize} Tf 50 ${y.toFixed(1)} Td (${escapePdfText(item.text)}) Tj ET`);
    y -= lineHeight;
  }
  if (currentOps.length > 0 || pages.length === 0) {
    pages.push(currentOps.join('\n'));
  }

  // Construct valid PDF 1.4 objects
  const objects: string[] = [];
  // 1: Catalog, 2: Pages, 3: Font F1 (Helvetica), 4: Font F2 (Helvetica-Bold)
  const pageObjNumbers: number[] = [];
  let nextObjNum = 5;

  const pageEntries: { pageObj: number; contentObj: number; stream: string }[] = [];
  for (const pStream of pages) {
    const pageObj = nextObjNum++;
    const contentObj = nextObjNum++;
    pageObjNumbers.push(pageObj);
    pageEntries.push({ pageObj, contentObj, stream: pStream });
  }

  objects[1] = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  objects[2] = `2 0 obj\n<< /Type /Pages /Kids [${pageObjNumbers.map((n) => `${n} 0 R`).join(' ')}] /Count ${pageObjNumbers.length} >>\nendobj\n`;
  objects[3] = `3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;
  objects[4] = `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`;

  for (const entry of pageEntries) {
    objects[entry.pageObj] = `${entry.pageObj} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${entry.contentObj} 0 R >>\nendobj\n`;
    const byteLen = Buffer.byteLength(entry.stream, 'utf8');
    objects[entry.contentObj] = `${entry.contentObj} 0 obj\n<< /Length ${byteLen} >>\nstream\n${entry.stream}\nendstream\nendobj\n`;
  }

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (let i = 1; i < nextObjNum; i++) {
    offsets[i] = Buffer.byteLength(pdf, 'utf8');
    pdf += objects[i];
  }
  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${nextObjNum}\n0000000000 65535 f \n`;
  for (let i = 1; i < nextObjNum; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${nextObjNum} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, 'utf8');
}

/**
 * GET /api/v1/products/:slug/datasheet
 * Streams the official Milanote PDF brochure if attached, or generates a clean PDF datasheet from the exact Milanote content.
 */
router.get('/products/:slug/datasheet', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawParam = String(req.params.slug).trim().toLowerCase();
    const product = await Product.findOne({
      slug: rawParam,
      published: true,
      isDeleted: { $ne: true },
    })
      .lean()
      .exec();

    if (!product) {
      throw new AppError(`Product not found for datasheet: ${rawParam}`, 404);
    }

    const remoteUrl = (product.datasheetUrl || product.brochureUrl || '').trim();
    if (remoteUrl.startsWith('http://') || remoteUrl.startsWith('https://')) {
      if (remoteUrl.toLowerCase().endsWith('.pptx') || remoteUrl.toLowerCase().endsWith('.docx')) {
        res.redirect(302, remoteUrl);
        return;
      }
      try {
        const upstream = await fetch(remoteUrl);
        if (upstream.ok) {
          const contentType = upstream.headers.get('content-type') || 'application/pdf';
          const arrayBuf = await upstream.arrayBuffer();
          const buf = Buffer.from(arrayBuf);
          const extMatch = remoteUrl.split('?')[0].match(/\.(pdf|pptx|docx)$/i);
          const ext = extMatch ? extMatch[1].toLowerCase() : 'pdf';
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${product.slug}-brochure.${ext}"`);
          res.setHeader('Content-Length', String(buf.length));
          res.status(200).send(buf);
          return;
        }
      } catch {
        res.redirect(302, remoteUrl);
        return;
      }
    }

    const pdfBuf = buildProductPdfBuffer(product as unknown as Record<string, unknown>);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${product.slug}.pdf"`);
    res.setHeader('Content-Length', String(pdfBuf.length));
    res.status(200).send(pdfBuf);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/articles
 * Returns published articles & newsletters with type, category, year, quarter, and search filters.
 */
router.get('/articles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, category, year, quarter, search } = req.query;
    const filter: Record<string, unknown> = {
      published: true,
    };

    if (typeof type === 'string' && (type === 'blog' || type === 'newsletter')) {
      filter.type = type;
    }
    if (typeof category === 'string' && category.trim()) {
      filter.category = category.trim();
    }
    if (typeof year === 'string' && !Number.isNaN(Number(year))) {
      filter.year = Number(year);
    }
    if (typeof quarter === 'string' && ['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
      filter.quarter = quarter;
    }
    if (typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { summary: regex }, { content: regex }, { category: regex }];
    }

    const articles = await Article.find(filter)
      .sort({ publishedDate: -1, issueNumber: -1, createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/articles/:slug
 * Returns full published article/newsletter content by slug.
 */
router.get('/articles/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = String(req.params.slug).toLowerCase().trim();
    const article = await Article.findOne({
      slug,
      published: true,
    })
      .lean()
      .exec();

    if (!article) {
      throw new AppError(`Article not found for slug: ${slug}`, 404);
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/articles/:slug/pdf
 * Streams or redirects to the newsletter/article PDF document, or generates a clean PDF if no external pdfUrl is set.
 */
router.get('/articles/:slug/pdf', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawParam = String(req.params.slug).trim().toLowerCase();
    const article = await Article.findOne({
      slug: rawParam,
      published: true,
    })
      .lean()
      .exec();

    if (!article) {
      throw new AppError(`Article not found for PDF download: ${rawParam}`, 404);
    }

    const remoteUrl = (article.pdfUrl || '').trim();
    if (remoteUrl.startsWith('http://') || remoteUrl.startsWith('https://')) {
      try {
        const upstream = await fetch(remoteUrl);
        if (upstream.ok) {
          const arrayBuf = await upstream.arrayBuffer();
          const buf = Buffer.from(arrayBuf);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${article.slug}.pdf"`);
          res.setHeader('Content-Length', String(buf.length));
          res.status(200).send(buf);
          return;
        }
      } catch {
        res.redirect(302, remoteUrl);
        return;
      }
    }

    const plainBody = String(article.content || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const pdfBuf = buildProductPdfBuffer({
      name: article.title,
      brand: article.type === 'newsletter' ? `Sudabelt Newsletter Issue #${article.issueNumber || 1}` : 'Sudabelt Clinical Journal',
      categoryLabel: `${article.category} ${article.quarter ? `| ${article.quarter}` : ''} ${article.year || ''}`.trim(),
      fullOverview: article.summary,
      usps: plainBody,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${article.slug}.pdf"`);
    res.setHeader('Content-Length', String(pdfBuf.length));
    res.status(200).send(pdfBuf);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/projects
 * Returns all published projects with category, year, and search filters.
 */
router.get('/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, year, featured, search } = req.query;
    const filter: Record<string, unknown> = {
      published: true,
      isDeleted: { $ne: true },
    };

    if (typeof category === 'string' && category.trim() && category !== 'All projects') {
      filter.category = new RegExp(category.trim(), 'i');
    }
    if (typeof year === 'string' && !Number.isNaN(Number(year))) {
      filter.completionYear = Number(year);
    }
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    if (typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { facilityName: regex },
        { locationState: regex },
        { shortDescription: regex },
        { fullDescription: regex },
      ];
    }

    const projects = await Project.find(filter)
      .sort({ isFeatured: -1, completionYear: -1, createdAt: -1 })
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

/**
 * GET /api/v1/projects/:slug
 * Returns individual published project details by slug.
 */
router.get('/projects/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = String(req.params.slug).toLowerCase().trim();
    const project = await Project.findOne({
      slug,
      published: true,
      isDeleted: { $ne: true },
    })
      .lean()
      .exec();

    if (!project) {
      throw new AppError(`Project not found for slug: ${slug}`, 404);
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/newsletter/subscribe
 * Public newsletter subscription.
 */
router.post('/newsletter/subscribe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({
      email: z.string().trim().email(),
      name: z.string().trim().optional(),
      institution: z.string().trim().optional(),
      source: z.string().trim().optional().default('website_footer'),
    });

    const parsed = schema.parse(req.body);
    const normalizedEmail = parsed.email.toLowerCase();

    const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail }).lean().exec();
    if (existing) {
      res.status(200).json({
        success: true,
        message: 'You are already subscribed to Sudabelt Medical insights.',
      });
      return;
    }

    await NewsletterSubscriber.create({
      ...parsed,
      email: normalizedEmail,
      isActive: true,
      subscribedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to Sudabelt Medical newsletter.',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/newsletter/issues
 * Returns published newsletter issues.
 */
router.get('/newsletter/issues', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const issues = await NewsletterCampaign.find({ published: true })
      .sort({ issueNumber: -1, createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
