import mongoose from 'mongoose';
import {
  Product,
  Article,
  Project,
  NewsletterSubscriber,
  NewsletterCampaign,
  User,
  RFQ,
  AfterSalesTicket,
  LeadMagnet,
  TrainingRegistration,
  ContactInquiry,
} from '../models';
import { createModelAdapter } from '../services/modelAdapter';

let isUsingFileStorage = false;

export const getDbStatus = (): { mode: 'mongodb' | 'file'; connected: boolean } => {
  if (isUsingFileStorage) {
    return { mode: 'file', connected: true };
  }
  return {
    mode: 'mongodb',
    connected: mongoose.connection.readyState === 1,
  };
};

/**
 * Binds our file-backed JSON engine to exported Mongoose models so all queries work
 * offline and in development without requiring a local mongod daemon.
 */
const bindFileStorageAdapters = () => {
  isUsingFileStorage = true;
  console.log('[Storage Engine] Binding persistent JSON database (server/data/db.json) to models...');

  Object.assign(Product, createModelAdapter('products'));
  Object.assign(Article, createModelAdapter('articles'));
  Object.assign(Project, createModelAdapter('projects'));
  Object.assign(NewsletterSubscriber, createModelAdapter('subscribers'));
  Object.assign(NewsletterCampaign, createModelAdapter('campaigns'));
  Object.assign(User, createModelAdapter('users'));
  Object.assign(RFQ, createModelAdapter('rfqs'));
  Object.assign(AfterSalesTicket, createModelAdapter('tickets'));
  Object.assign(LeadMagnet, createModelAdapter('leads'));
  Object.assign(TrainingRegistration, createModelAdapter('trainings'));
  Object.assign(ContactInquiry, createModelAdapter('inquiries'));

  console.log('[Storage Engine] All 11 models successfully backed by persistent JSON storage.');
};

/**
 * Connects to MongoDB if available, otherwise seamlessly activates local persistent JSON storage.
 */
export const connectDB = async (): Promise<typeof mongoose | null> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sudabelt_medical';

  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (_error) {
    console.warn('[MongoDB] MongoDB server unreachable on', mongoUri);
    console.log('[Database] Activating integrated persistent file storage engine...');
    bindFileStorageAdapters();
    return null;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (!isUsingFileStorage && mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed gracefully.');
  }
};
