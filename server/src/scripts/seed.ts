import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import {
  Product,
  Article,
  Project,
  NewsletterSubscriber,
  NewsletterCampaign,
  User,
  RFQ,
  AfterSalesTicket,
} from '../models';
import { hashPassword } from '../utils/auth.utils';
import { storage } from '../services/storageService';
import { SEED_PRODUCTS } from './seedData/products.seed';

// Cleared so user can test adding projects, articles, newsletters, RFQs and tickets via the CMS
const SEED_PROJECTS: any[] = [];
const SEED_ARTICLES: any[] = [];
const SEED_NEWSLETTER_CAMPAIGNS: any[] = [];
const SEED_RFQS: any[] = [];
const SEED_TICKETS: any[] = [];

const SEED_USERS = [
  {
    name: 'Sudabelt Executive Superadmin',
    email: 'admin@sudabelt.com',
    passwordHash: hashPassword('SudabeltAdmin2026!'),
    role: 'superadmin',
    isActive: true,
  },
  {
    name: 'Biomedical Operations Lead',
    email: 'biomed@sudabelt.com',
    passwordHash: hashPassword('SudabeltBiomed2026!'),
    role: 'admin',
    isActive: true,
  },
  {
    name: 'Clinical Content Editor',
    email: 'editor@sudabelt.com',
    passwordHash: hashPassword('SudabeltEditor2026!'),
    role: 'editor',
    isActive: true,
  },
];

const SEED_SUBSCRIBERS = [
  {
    email: 'cmo@lagoonhospitals.com',
    name: 'Dr. Adebayo Ogunlesi',
    institution: 'Iwosan Lagoon Hospitals, Lagos',
    source: 'website_footer',
    isActive: true,
    subscribedAt: new Date('2026-01-15T10:00:00Z'),
  },
  {
    email: 'procurement@nationalhospitalabuja.gov.ng',
    name: 'Engr. Ibrahim Danjuma',
    institution: 'National Hospital Abuja',
    source: 'newsletter_page',
    isActive: true,
    subscribedAt: new Date('2026-02-02T14:30:00Z'),
  },
  {
    email: 'renal.unit@uch-ibadan.org.ng',
    name: 'Matron Funmilayo Adeyemi',
    institution: 'University College Hospital (UCH), Ibadan',
    source: 'lead_magnet',
    isActive: true,
    subscribedAt: new Date('2026-02-19T09:15:00Z'),
  },
];

// Mock RFQs and tickets cleared for user testing
// SEED_RFQS and SEED_TICKETS are initialized as empty arrays above

export const runSeed = async () => {
  console.log('[Seed] Initializing comprehensive Milanote database seeding...');
  await connectDB();

  const isMongoConnected = mongoose.connection.readyState === 1;
  // Reset collections in local file storage so old test artifacts are cleared cleanly
  storage.getCollection('products').length = 0;
  storage.getCollection('projects').length = 0;
  storage.getCollection('articles').length = 0;
  storage.getCollection('campaigns').length = 0;

  if (isMongoConnected) {
    // Clear existing catalog collections in MongoDB before re-seeding approved Milanote documents
    await Product.deleteMany({});
    await Project.deleteMany({});
    await Article.deleteMany({});
    await NewsletterCampaign.deleteMany({});
  }

  console.log('[Seed] 1. Seeding Users / Administrators...');
  for (const u of SEED_USERS) {
    const existing = await User.findOne({ email: u.email }).exec().catch(() => null);
    if (!existing) {
      await User.create(u);
      console.log(`  + Created user: ${u.email} (${u.role})`);
    }
  }

  console.log(`[Seed] 2. Seeding ${SEED_PROJECTS.length} Milanote Projects...`);
  for (const p of SEED_PROJECTS) {
    const created = await Project.create(p);
    if (isMongoConnected) {
      const obj = typeof created.toObject === 'function' ? created.toObject() : created;
      storage.getCollection('projects').push(obj as unknown as Record<string, unknown>);
    }
    console.log(`  + Seeded project: ${p.title} (${p.locationState}, ${p.completionYear})`);
  }

  const techCount = SEED_PRODUCTS.filter((p) => !p.isConsumable).length;
  const consCount = SEED_PRODUCTS.filter((p) => p.isConsumable).length;
  console.log(
    `[Seed] 3. Seeding ${SEED_PRODUCTS.length} Milanote Portfolio Products (${techCount} Technologies + ${consCount} Consumables)...`
  );
  for (const pr of SEED_PRODUCTS) {
    const created = await Product.create(pr);
    if (isMongoConnected) {
      const obj = typeof created.toObject === 'function' ? created.toObject() : created;
      storage.getCollection('products').push(obj as unknown as Record<string, unknown>);
    }
  }
  console.log(`  + Successfully seeded all ${SEED_PRODUCTS.length} products across 6 categories & 8 OEM partners.`);

  console.log(`[Seed] 4. Seeding ${SEED_ARTICLES.length} Articles (Blogs & Inner Circle Newsletters)...`);
  for (const a of SEED_ARTICLES) {
    const created = await Article.create(a);
    if (isMongoConnected) {
      const obj = typeof created.toObject === 'function' ? created.toObject() : created;
      storage.getCollection('articles').push(obj as unknown as Record<string, unknown>);
    }
    console.log(`  + Seeded ${a.type}: ${a.title}`);
  }

  console.log(`[Seed] 5. Seeding ${SEED_NEWSLETTER_CAMPAIGNS.length} "The Inner Circle" Newsletter Campaigns...`);
  for (const c of SEED_NEWSLETTER_CAMPAIGNS) {
    const created = await NewsletterCampaign.create(c);
    if (isMongoConnected) {
      const obj = typeof created.toObject === 'function' ? created.toObject() : created;
      storage.getCollection('campaigns').push(obj as unknown as Record<string, unknown>);
    }
    console.log(`  + Seeded newsletter edition #${c.issueNumber}: ${c.title}`);
  }

  console.log('[Seed] 6. Seeding Newsletter Subscribers...');
  for (const s of SEED_SUBSCRIBERS) {
    const existing = await NewsletterSubscriber.findOne({ email: s.email }).exec().catch(() => null);
    if (!existing) {
      await NewsletterSubscriber.create(s);
    }
  }

  console.log('[Seed] 7. Seeding Sample RFQs & Support Tickets...');
  for (const r of SEED_RFQS) {
    const existing = await RFQ.findOne({ referenceId: r.referenceId }).exec().catch(() => null);
    if (!existing) {
      await RFQ.create(r);
    }
  }
  for (const t of SEED_TICKETS) {
    const existing = await AfterSalesTicket.findOne({ ticketId: t.ticketId }).exec().catch(() => null);
    if (!existing) {
      await AfterSalesTicket.create(t);
    }
  }

  storage.save();
  console.log('[Seed] All Milanote seed documents written and persisted successfully!');
  await disconnectDB();
};

if (process.argv[1]?.includes('seed')) {
  runSeed()
    .then(() => {
      console.log('[Seed] Process finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Failed:', err);
      process.exit(1);
    });
}
