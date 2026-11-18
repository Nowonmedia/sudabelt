import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  email: string;
  name?: string;
  institution?: string;
  source: string;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    name: { type: String, trim: true },
    institution: { type: String, trim: true },
    source: { type: String, default: 'website_footer', trim: true },
    isActive: { type: Boolean, default: true, index: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export const NewsletterSubscriber = mongoose.model<INewsletterSubscriber>(
  'NewsletterSubscriber',
  NewsletterSubscriberSchema
);

export interface INewsletterCampaign extends Document {
  title: string;
  slug: string;
  subject: string;
  issueNumber: number;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  summary: string;
  content: string;
  coverImage?: string;
  pdfUrl?: string;
  status: 'draft' | 'scheduled' | 'sent';
  sentAt?: Date;
  recipientCount?: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterCampaignSchema = new Schema<INewsletterCampaign>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    issueNumber: { type: Number, required: true, index: true },
    quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'] },
    year: { type: Number, required: true, default: 2026 },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    coverImage: { type: String, trim: true },
    pdfUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sent'],
      default: 'draft',
      index: true,
    },
    sentAt: { type: Date },
    recipientCount: { type: Number, default: 0 },
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const NewsletterCampaign = mongoose.model<INewsletterCampaign>(
  'NewsletterCampaign',
  NewsletterCampaignSchema
);
