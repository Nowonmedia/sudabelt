import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product } from '../models/Product';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const OFFICIAL_MILANOTE_DOCS: Record<string, string> = {
  'ge-voluson-expert-22':
    'https://media.milanote.com/p/files/1WYyRE1oRhl26N/q95/2024%20Voluson-Expert-22-BT25%20brochure_JB30021XX.pdf',
  'voluson-expert-22':
    'https://media.milanote.com/p/files/1WYyRE1oRhl26N/q95/2024%20Voluson-Expert-22-BT25%20brochure_JB30021XX.pdf',
  'ge-logiq-e10-ultrasound-system':
    'https://media.milanote.com/p/files/1WYw4614fvoT5S/kxS/GI-presentation-logiq-e10s-r5-whats-new-giu-jan-2026-JB36682XX-JB00740BH.pptx',
  'logiq-e10-ultrasound-system':
    'https://media.milanote.com/p/files/1WYw4614fvoT5S/kxS/GI-presentation-logiq-e10s-r5-whats-new-giu-jan-2026-JB36682XX-JB00740BH.pptx',
  'ge-vivid-e95':
    'https://media.milanote.com/p/files/1WYyBG1oRhl26M/Xvs/ULS-EAGM-Showpad-CVS-Vivid-E95-Interventional-Brochure-JB00125BH.pdf',
  'vivid-e95':
    'https://media.milanote.com/p/files/1WYyBG1oRhl26M/Xvs/ULS-EAGM-Showpad-CVS-Vivid-E95-Interventional-Brochure-JB00125BH.pdf',
  'ge-venue-go':
    'https://media.milanote.com/p/files/1WYzPU1oRhl26O/aWj/ULS-EAGM-Showpad-%20brochure-venue-family-pocus-r5-JB00140BH.pdf',
  'venue-go':
    'https://media.milanote.com/p/files/1WYzPU1oRhl26O/aWj/ULS-EAGM-Showpad-%20brochure-venue-family-pocus-r5-JB00140BH.pdf',
};

async function run() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI missing');

  await mongoose.connect(mongoUri);
  for (const [slug, url] of Object.entries(OFFICIAL_MILANOTE_DOCS)) {
    const updated = await Product.findOneAndUpdate(
      { slug },
      { $set: { datasheetUrl: url, brochureUrl: url } },
      { new: true }
    )
      .lean()
      .exec();
    if (updated) {
      console.log(`Updated ${slug} -> ${updated.datasheetUrl}`);
    }
  }

  const dbJsonPath = path.resolve(__dirname, '../../data/db.json');
  if (fs.existsSync(dbJsonPath)) {
    const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));
    if (Array.isArray(dbData.products)) {
      for (const p of dbData.products) {
        if (p.slug && OFFICIAL_MILANOTE_DOCS[p.slug]) {
          p.datasheetUrl = OFFICIAL_MILANOTE_DOCS[p.slug];
          p.brochureUrl = OFFICIAL_MILANOTE_DOCS[p.slug];
        }
      }
      fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf-8');
      console.log('Synced official Milanote datasheetUrls to server/data/db.json');
    }
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
