import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  modelNumber: string;
  sku?: string;
  brand: string;
  category: string;
  shortDescription: string;
  fullOverview: string;
  specifications: Record<string, unknown>;
  keyFeatures?: { title: string; description: string }[];
  clinicalApplications?: string[];
  complianceCertifications?: string[];
  images?: {
    primaryCutout?: string;
    contextualGallery?: string[];
    altText?: string;
  };
  isConsumable: boolean;
  datasheetUrl: string;
  pricingNotes?: string;
  compatibleProductSlugs?: string[];
  supportPackage?: {
    installationIncluded?: boolean;
    clinicalTrainingHours?: number;
    targetTrainees?: string[];
    preventiveMaintenanceSLA?: string;
    warrantyPeriod?: string;
    localSparePartsStocked?: boolean;
  };
  faqs?: { question: string; answer: string }[];
  seoMeta?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  published: boolean;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    modelNumber: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    shortDescription: { type: String, required: true, trim: true },
    fullOverview: { type: String, required: true, trim: true },
    specifications: { type: Schema.Types.Mixed, default: {} },
    keyFeatures: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        _id: false,
      },
    ],
    clinicalApplications: [{ type: String, trim: true }],
    complianceCertifications: [{ type: String, trim: true }],
    images: {
      primaryCutout: { type: String, trim: true },
      contextualGallery: [{ type: String, trim: true }],
      altText: { type: String, trim: true },
    },
    isConsumable: { type: Boolean, default: false, index: true },
    datasheetUrl: { type: String, trim: true, default: '' },
    pricingNotes: { type: String, trim: true },
    compatibleProductSlugs: [{ type: String, trim: true }],
    supportPackage: {
      installationIncluded: { type: Boolean, default: true },
      clinicalTrainingHours: { type: Number, default: 40 },
      targetTrainees: [{ type: String, trim: true }],
      preventiveMaintenanceSLA: { type: String, trim: true },
      warrantyPeriod: { type: String, trim: true },
      localSparePartsStocked: { type: Boolean, default: true },
    },
    faqs: [
      {
        question: { type: String, trim: true },
        answer: { type: String, trim: true },
        _id: false,
      },
    ],
    seoMeta: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      keywords: [{ type: String, trim: true }],
    },
    published: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
