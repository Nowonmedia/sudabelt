import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db';
import { Product, Project, Article, NewsletterCampaign } from '../models';
import { isCloudinaryConfigured, uploadToCloudinary } from '../services/cloudinaryService';
import { storage } from '../services/storageService';

const shouldMigrateUrl = (url?: string): boolean => {
  if (!url) return false;
  if (url.includes('res.cloudinary.com')) return false;
  if (url.toLowerCase().endsWith('.pdf')) return false;
  return url.startsWith('https://app.milanote.com/') || url.startsWith('https://media.milanote.com/');
};

const runCloudinarySync = async () => {
  if (!isCloudinaryConfigured()) {
    console.error(
      '[Cloudinary Sync] Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET in server/.env.'
    );
    process.exit(1);
  }

  console.log('[Cloudinary Sync] Connecting to database & syncing Milanote assets to Cloudinary...');
  await connectDB();

  // 1. Sync Products (primaryImage, galleryImages, datasheetUrl)
  const products = await Product.find({}).lean().exec();
  for (const prod of products) {
    let updated = false;
    const newGallery: string[] = [];
    const currentGallery = Array.isArray(prod.galleryImages)
      ? prod.galleryImages
      : prod.images?.contextualGallery || [];

    for (let i = 0; i < currentGallery.length; i++) {
      const imgUrl = currentGallery[i];
      if (shouldMigrateUrl(imgUrl)) {
        try {
          const res = await uploadToCloudinary({
            fileSource: imgUrl,
            folder: `sudabelt/products/${prod.category}`,
            publicId: `${prod.slug}_${i + 1}`,
            resourceType: 'image',
          });
          newGallery.push(res.optimizedUrl);
          updated = true;
          console.log(`  ✓ Uploaded product image: ${prod.slug} [${i + 1}] -> ${res.optimizedUrl}`);
        } catch (err) {
          console.warn(`  ! Failed product image ${prod.slug}:`, err);
          newGallery.push(imgUrl);
        }
      } else {
        newGallery.push(imgUrl);
      }
    }

    let newDatasheet = prod.datasheetUrl || '';
    if (prod.datasheetUrl && shouldMigrateUrl(prod.datasheetUrl)) {
      try {
        const res = await uploadToCloudinary({
          fileSource: prod.datasheetUrl,
          folder: 'sudabelt/datasheets',
          publicId: `${prod.slug}_brochure`,
          resourceType: 'raw',
        });
        newDatasheet = res.secureUrl;
        updated = true;
        console.log(`  ✓ Uploaded product datasheet: ${prod.slug} -> ${res.secureUrl}`);
      } catch (err) {
        console.warn(`  ! Failed datasheet ${prod.slug}:`, err);
      }
    }

    if (updated) {
      const primary = newGallery[0] || prod.primaryImage;
      await Product.findOneAndUpdate(
        { _id: prod._id },
        {
          $set: {
            primaryImage: primary,
            galleryImages: newGallery,
            datasheetUrl: newDatasheet,
            brochureUrl: newDatasheet,
            images: {
              primaryCutout: primary,
              contextualGallery: newGallery,
              altText: prod.images?.altText || prod.name,
            },
          },
        }
      );
    }
  }

  // 2. Sync Projects (heroImage, galleryImages)
  const projects = await Project.find({}).lean().exec();
  for (const proj of projects) {
    let updated = false;
    const newGallery: string[] = [];
    const currentGallery = Array.isArray(proj.galleryImages) ? proj.galleryImages : [proj.heroImage];

    for (let i = 0; i < currentGallery.length; i++) {
      const imgUrl = currentGallery[i];
      if (shouldMigrateUrl(imgUrl)) {
        try {
          const res = await uploadToCloudinary({
            fileSource: imgUrl,
            folder: 'sudabelt/projects',
            publicId: `${proj.slug}_${i + 1}`,
            resourceType: 'image',
          });
          newGallery.push(res.optimizedUrl);
          updated = true;
          console.log(`  ✓ Uploaded project photo: ${proj.slug} [${i + 1}] -> ${res.optimizedUrl}`);
        } catch (err) {
          console.warn(`  ! Failed project photo ${proj.slug}:`, err);
          newGallery.push(imgUrl);
        }
      } else {
        newGallery.push(imgUrl);
      }
    }

    let newHero = proj.heroImage;
    if (shouldMigrateUrl(proj.heroImage)) {
      newHero = newGallery[0] || proj.heroImage;
      updated = true;
    }

    if (updated) {
      await Project.findOneAndUpdate(
        { _id: proj._id },
        { $set: { heroImage: newHero, galleryImages: newGallery } }
      );
    }
  }

  // 3. Sync Newsletter Campaigns & Articles (coverImage, pdfUrl)
  const campaigns = await NewsletterCampaign.find({}).lean().exec();
  for (const camp of campaigns) {
    let newCover = camp.coverImage;
    let newPdf = camp.pdfUrl;
    let updated = false;

    if (shouldMigrateUrl(camp.coverImage)) {
      try {
        const res = await uploadToCloudinary({
          fileSource: camp.coverImage!,
          folder: 'sudabelt/newsletters/covers',
          publicId: `${camp.slug}_cover`,
          resourceType: 'image',
        });
        newCover = res.optimizedUrl;
        updated = true;
        console.log(`  ✓ Uploaded newsletter cover: ${camp.slug} -> ${res.optimizedUrl}`);
      } catch (err) {
        console.warn(`  ! Failed newsletter cover ${camp.slug}:`, err);
      }
    }

    if (shouldMigrateUrl(camp.pdfUrl)) {
      try {
        const res = await uploadToCloudinary({
          fileSource: camp.pdfUrl!,
          folder: 'sudabelt/newsletters/pdfs',
          publicId: `${camp.slug}_pdf`,
          resourceType: 'raw',
        });
        newPdf = res.secureUrl;
        updated = true;
        console.log(`  ✓ Uploaded newsletter PDF: ${camp.slug} -> ${res.secureUrl}`);
      } catch (err) {
        console.warn(`  ! Failed newsletter PDF ${camp.slug}:`, err);
      }
    }

    if (updated) {
      await NewsletterCampaign.findOneAndUpdate(
        { _id: camp._id },
        { $set: { coverImage: newCover, pdfUrl: newPdf } }
      );
      await Article.findOneAndUpdate(
        { slug: camp.slug },
        { $set: { coverImage: newCover, pdfUrl: newPdf } }
      );
    }
  }

  storage.save();
  console.log('[Cloudinary Sync] Completed successfully!');
  await disconnectDB();
};

runCloudinarySync().catch((err) => {
  console.error('[Cloudinary Sync] Fatal error:', err);
  process.exit(1);
});
