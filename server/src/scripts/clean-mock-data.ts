import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { connectDB, disconnectDB } from '../config/db';
import {
  RFQ,
  AfterSalesTicket,
  ContactInquiry,
  TrainingRegistration,
  LeadMagnet,
  Project,
  Article,
  NewsletterCampaign,
} from '../models';
import fs from 'fs';

async function cleanMockData() {
  console.log('[Cleanup] Connecting to database...');
  await connectDB();

  console.log('[Cleanup] Clearing mock RFQs, Tickets, Contact Inquiries, Trainings, Leads...');
  const rfqRes = await RFQ.deleteMany({});
  const ticketRes = await AfterSalesTicket.deleteMany({});
  const inquiryRes = await ContactInquiry.deleteMany({});
  const trainingRes = await TrainingRegistration.deleteMany({});
  const leadRes = await LeadMagnet.deleteMany({});

  console.log(`  - Deleted ${rfqRes.deletedCount} RFQs`);
  console.log(`  - Deleted ${ticketRes.deletedCount} After-Sales Support Tickets`);
  console.log(`  - Deleted ${inquiryRes.deletedCount} Contact Inquiries`);
  console.log(`  - Deleted ${trainingRes.deletedCount} Training Registrations`);
  console.log(`  - Deleted ${leadRes.deletedCount} Lead Captures`);

  console.log('[Cleanup] Clearing Projects, Blogs/Articles, and Newsletter Campaigns (so user can add via CMS)...');
  const projRes = await Project.deleteMany({});
  const artRes = await Article.deleteMany({});
  const campRes = await NewsletterCampaign.deleteMany({});

  console.log(`  - Deleted ${projRes.deletedCount} Projects`);
  console.log(`  - Deleted ${artRes.deletedCount} Articles/Blogs`);
  console.log(`  - Deleted ${campRes.deletedCount} Newsletter Campaigns`);

  // Also clean server/data/db.json
  const dbPath = path.resolve(__dirname, '../../../server/data/db.json');
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    db.rfqs = [];
    db.tickets = [];
    db.inquiries = [];
    db.trainings = [];
    db.leads = [];
    db.projects = [];
    db.articles = [];
    db.campaigns = [];
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    console.log('[Cleanup] Updated server/data/db.json with empty lists for cleared collections.');
  }

  await disconnectDB();
  console.log('[Cleanup] Done! Database is clean and ready for user testing.');
}

cleanMockData().catch((err) => {
  console.error('[Cleanup] Failed:', err);
  process.exit(1);
});
