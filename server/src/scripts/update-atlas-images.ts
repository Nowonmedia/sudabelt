import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { connectDB, disconnectDB } from '../config/db';
import { Product } from '../models/Product';
import { SEED_PRODUCTS } from './seedData/products.seed';

async function updateAtlasProducts() {
  await connectDB();
  console.log('[Atlas Sync] Updating products in MongoDB Atlas with verified Cloudinary URLs...');
  let updatedCount = 0;
  for (const p of SEED_PRODUCTS) {
    const res = await Product.findOneAndUpdate(
      { slug: p.slug },
      {
        $set: {
          primaryImage: p.primaryImage,
          galleryImages: p.galleryImages,
          images: p.images,
        },
      },
      { new: true }
    );
    if (res) updatedCount++;
  }
  console.log(`[Atlas Sync] Successfully updated ${updatedCount} products in MongoDB Atlas.`);
  await disconnectDB();
}

updateAtlasProducts().catch((err) => {
  console.error('[Atlas Sync] Error:', err);
  process.exit(1);
});
