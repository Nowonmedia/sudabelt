import mongoose, { Document, Schema } from 'mongoose';

export type ArticleType = 'blog' | 'newsletter';

export interface IArticle extends Document {
  title: string;
  slug: string;
  type: ArticleType;
  issueNumber?: number;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year?: number;
  category: string;
  summary: string;
  content: string;
  takeaways?: string[];
  coverImage: string;
  pdfUrl?: string;
  readTimeMinutes?: number;
  featuredProductSlugs?: string[];
  publishedDate: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    type: {
      type: String,
      enum: ['blog', 'newsletter'],
      required: true,
      default: 'newsletter',
      index: true,
    },
    issueNumber: { type: Number },
    quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'] },
    year: { type: Number, index: true },
    category: { type: String, required: true, trim: true, index: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    takeaways: [{ type: String, trim: true }],
    coverImage: { type: String, trim: true, default: '' },
    pdfUrl: { type: String, trim: true },
    readTimeMinutes: { type: Number, default: 5 },
    featuredProductSlugs: [{ type: String, trim: true }],
    publishedDate: { type: Date, default: Date.now, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);
