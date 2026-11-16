import { Router, Request, Response, NextFunction } from 'express';
import { Product, Article } from '../models';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/v1/products
 * Returns all published products with category, brand, consumable type, and search filters.
 */
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, brand, isConsumable, search } = req.query;
    const filter: Record<string, unknown> = {
      published: true,
      isDeleted: { $ne: true },
    };

    if (typeof category === 'string' && category.trim()) {
      filter.category = category.trim();
    }
    if (typeof brand === 'string' && brand.trim()) {
      filter.brand = brand.trim();
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
        { fullOverview: regex },
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

/**
 * GET /api/v1/products/:slug
 * Returns individual published product details by slug.
 */
router.get('/products/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = String(req.params.slug).toLowerCase().trim();
    const product = await Product.findOne({
      slug,
      published: true,
      isDeleted: { $ne: true },
    })
      .lean()
      .exec();

    if (!product) {
      throw new AppError(`Product not found for slug: ${slug}`, 404);
    }

    res.status(200).json({
      success: true,
      data: product,
    });
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

export default router;
