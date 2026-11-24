import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Article } from '../models/Article';
import { uploadToCloudinary } from '../services/cloudinaryService';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface ExtractedBlog {
  slug: string;
  url: string;
  title: string;
  subtitle: string;
  author: string;
  dateStr: string;
  readTime: string;
  categories: string[];
  coverImage: string;
  allImages: string[];
  richtextHtml: string;
  plainTextPreview: string;
}

function inferCategory(blog: ExtractedBlog): string {
  const t = (blog.title + ' ' + blog.plainTextPreview).toLowerCase();
  if (t.includes('sickle cell') || t.includes('outreach') || t.includes('community')) {
    return 'CSR';
  }
  if (
    t.includes('ultrasound') ||
    t.includes('ct scanner') ||
    t.includes('revolution maxima') ||
    t.includes('radiographic') ||
    t.includes('strain imaging') ||
    t.includes('cardiac')
  ) {
    return 'Imaging';
  }
  if (
    t.includes('spectra optia') ||
    t.includes('mirasol') ||
    t.includes('arcet') ||
    t.includes('blood')
  ) {
    return 'Blood Safety & Apheresis';
  }
  if (t.includes('cleancart') || t.includes('dialysis')) {
    return 'Renal Care';
  }
  if (t.includes('architect i1000') || t.includes('sigma') || t.includes('laboratory')) {
    return 'Laboratory & Diagnostics';
  }
  if (t.includes('airvo') || t.includes('anaesthetic') || t.includes('anesthesia')) {
    return 'Critical & Respiratory Care';
  }
  if (t.includes('training') || t.includes('sterilizing')) {
    return 'E-Learning';
  }
  return 'General Tips';
}

async function uploadRemoteUrlToCloudinary(url: string, publicId: string): Promise<string> {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) return url;

  try {
    const res = await uploadToCloudinary({
      fileSource: url,
      folder: 'sudabelt/blogs',
      publicId,
      resourceType: 'image',
    });
    return res.secureUrl;
  } catch {
    // Fallback: download with browser User-Agent and upload as base64 data URI
    const resp = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} for ${url}`);
    }
    const contentType = resp.headers.get('content-type') || 'image/png';
    const arrayBuffer = await resp.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:${contentType};base64,${base64}`;
    const res = await uploadToCloudinary({
      fileSource: dataUri,
      folder: 'sudabelt/blogs',
      publicId,
      resourceType: 'image',
    });
    return res.secureUrl;
  }
}

async function run() {
  const jsonPath =
    'C:\\Users\\creat\\.gemini\\antigravity\\brain\\8fd5f490-0716-4d4d-a4dd-588cad31cc8b\\scratch\\extracted_sudabelt_blogs.json';
  const rawBlogs: ExtractedBlog[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log(`Loaded ${rawBlogs.length} extracted blogs from sudabelt.com/categories`);

  // Collect all unique image URLs across all 18 blogs
  const uniqueUrls = new Set<string>();
  for (const b of rawBlogs) {
    if (b.coverImage) uniqueUrls.add(b.coverImage);
    for (const img of b.allImages) {
      if (img) uniqueUrls.add(img);
    }
  }

  console.log(`Uploading ${uniqueUrls.size} unique blog images to Cloudinary...`);
  const urlMap = new Map<string, string>();
  let idx = 0;
  for (const origUrl of uniqueUrls) {
    idx++;
    const baseName =
      origUrl
        .split('/')
        .pop()
        ?.split('?')[0]
        .replace(/%[0-9A-Fa-f]{2}/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_')
        .replace(/\.(png|jpg|jpeg|webp)$/i, '')
        .slice(0, 60) || `blog_img_${idx}`;
    const publicId = `blog_${idx}_${baseName}`;
    try {
      const cloudUrl = await uploadRemoteUrlToCloudinary(origUrl, publicId);
      urlMap.set(origUrl, cloudUrl);
      console.log(`  [${idx}/${uniqueUrls.size}] Uploaded -> ${cloudUrl}`);
    } catch (err) {
      console.error(`  [${idx}/${uniqueUrls.size}] Failed to upload ${origUrl}:`, err);
      urlMap.set(origUrl, origUrl);
    }
  }

  // Transform blogs into Article documents
  const articlesToSeed = rawBlogs.map((b) => {
    const coverCloud = urlMap.get(b.coverImage) || b.coverImage;
    const allCloud = b.allImages.map((u) => urlMap.get(u) || u).filter(Boolean);
    const galleryCloud = allCloud.filter((u) => u !== coverCloud);

    // Replace any original image URLs inside richtextHtml with their Cloudinary URLs
    let contentHtml = b.richtextHtml;
    for (const [origUrl, cloudUrl] of urlMap.entries()) {
      contentHtml = contentHtml.split(origUrl).join(cloudUrl);
    }

    const parsedDate = b.dateStr ? new Date(b.dateStr) : new Date();
    const publishedDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    const year = publishedDate.getFullYear();

    const readMatch = b.readTime.match(/(\d+)/);
    const readTimeMinutes = readMatch ? Number(readMatch[1]) : 7;

    const summary =
      b.subtitle && b.subtitle.trim().length > 5
        ? b.subtitle.trim()
        : b.plainTextPreview && b.plainTextPreview.trim().length > 5
          ? b.plainTextPreview.trim()
          : b.title;

    return {
      title: b.title,
      slug: b.slug,
      type: 'blog' as const,
      author: b.author || 'Sudabelt Medical',
      year,
      category: inferCategory(b),
      summary,
      content: contentHtml,
      takeaways: [],
      coverImage: coverCloud,
      galleryImages: galleryCloud,
      readTimeMinutes,
      featuredProductSlugs: [],
      publishedDate,
      published: true,
    };
  });

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set in server/.env');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB Atlas. Syncing blog articles...');

  const officialSlugs = articlesToSeed.map((a) => a.slug);
  await Article.deleteMany({ type: 'blog', slug: { $nin: officialSlugs } });

  for (const art of articlesToSeed) {
    await Article.findOneAndUpdate(
      { slug: art.slug },
      { $set: art },
      { upsert: true, new: true }
    );
    console.log(`  Upserted blog: ${art.slug} (${art.galleryImages.length} gallery images)`);
  }

  const totalBlogsInDb = await Article.countDocuments({ type: 'blog' });
  console.log(`Total blogs in MongoDB Atlas: ${totalBlogsInDb}`);

  const dbJsonPath = path.resolve(__dirname, '../../data/db.json');
  if (fs.existsSync(dbJsonPath)) {
    const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));
    const existingNonBlogs = (dbData.articles || []).filter(
      (a: { type?: string }) => a.type !== 'blog'
    );
    const dbBlogs = await Article.find({ type: 'blog' }).sort({ publishedDate: -1 }).lean().exec();
    dbData.articles = [...existingNonBlogs, ...dbBlogs];
    fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf-8');
    console.log(`Synced ${dbBlogs.length} blogs to server/data/db.json`);
  }

  await mongoose.disconnect();
  console.log('Done!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
