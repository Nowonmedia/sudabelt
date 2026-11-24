import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  modelNumber?: string;
  brand?: string;
  category: string;
  categoryLabel?: string;
  productType?: 'Technology' | 'Consumable';
  shortDescription?: string;
  fullOverview?: string;
  productFeatures?: string[];
  commonUses?: string[];
  usps?: string;
  otherInformation?: string[];
  specifications?: Record<string, unknown>;
  keyFeatures?: { title: string; description: string }[];
  clinicalApplications?: string[];
  primaryImage?: string;
  galleryImages?: string[];
  images?: {
    primaryCutout?: string;
    contextualGallery?: string[];
    altText?: string;
  };
  isConsumable: boolean;
  datasheetUrl?: string;
  brochureUrl?: string;
  videoUrl?: string;
  faqs?: { question: string; answer: string }[];
  published: boolean;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    modelNumber: { type: String, trim: true, default: '' },
    brand: { type: String, trim: true, default: '', index: true },
    category: { type: String, required: true, trim: true, index: true },
    categoryLabel: { type: String, trim: true, default: '' },
    productType: {
      type: String,
      enum: ['Technology', 'Consumable'],
      default: 'Technology',
      index: true,
    },
    shortDescription: { type: String, trim: true, default: '' },
    fullOverview: { type: String, trim: true, default: '' },
    productFeatures: [{ type: String, trim: true }],
    commonUses: [{ type: String, trim: true }],
    usps: { type: String, trim: true, default: '' },
    otherInformation: [{ type: String, trim: true }],
    specifications: { type: Schema.Types.Mixed, default: {} },
    keyFeatures: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        _id: false,
      },
    ],
    clinicalApplications: [{ type: String, trim: true }],
    primaryImage: { type: String, trim: true, default: '' },
    galleryImages: [{ type: String, trim: true }],
    images: {
      primaryCutout: { type: String, trim: true, default: '' },
      contextualGallery: [{ type: String, trim: true }],
      altText: { type: String, trim: true, default: '' },
    },
    isConsumable: { type: Boolean, default: false, index: true },
    datasheetUrl: { type: String, trim: true, default: '' },
    brochureUrl: { type: String, trim: true, default: '' },
    videoUrl: { type: String, trim: true, default: '' },
    faqs: [
      {
        question: { type: String, trim: true },
        answer: { type: String, trim: true },
        _id: false,
      },
    ],
    published: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
