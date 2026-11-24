import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  category: string;
  facilityName: string;
  locationState: string;
  city?: string;
  completionYear: number;
  isFeatured: boolean;
  heroImage: string;
  galleryImages?: string[];
  shortDescription: string;
  fullDescription: string;
  clientOrCommissionedBy?: string;
  scopeOfWork: string[];
  equipmentSupplied: string[];
  impactMetrics?: { label: string; value: string }[];
  published: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
      default: 'Hospital Equipping',
    },
    facilityName: { type: String, required: true, trim: true },
    locationState: { type: String, required: true, trim: true, index: true },
    city: { type: String, trim: true },
    completionYear: { type: Number, required: true, index: true, default: 2023 },
    isFeatured: { type: Boolean, default: false, index: true },
    heroImage: { type: String, required: true, trim: true },
    galleryImages: [{ type: String, trim: true }],
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, required: true, trim: true },
    clientOrCommissionedBy: { type: String, trim: true },
    scopeOfWork: [{ type: String, trim: true }],
    equipmentSupplied: [{ type: String, trim: true }],
    impactMetrics: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    published: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
