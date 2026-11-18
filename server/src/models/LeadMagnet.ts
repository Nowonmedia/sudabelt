import mongoose, { Document, Schema } from 'mongoose';

export interface ILeadMagnet extends Document {
  name: string;
  workEmail: string;
  phone?: string;
  facilityName: string;
  downloadedAssetSlug: string;
  downloadedAssetTitle?: string;
  downloadedAssetUrl?: string;
  downloadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadMagnetSchema = new Schema<ILeadMagnet>(
  {
    name: { type: String, required: true, trim: true },
    workEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true },
    facilityName: { type: String, required: true, trim: true },
    downloadedAssetSlug: { type: String, required: true, trim: true, index: true },
    downloadedAssetTitle: { type: String, trim: true },
    downloadedAssetUrl: { type: String, trim: true },
    downloadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const LeadMagnet = mongoose.model<ILeadMagnet>('LeadMagnet', LeadMagnetSchema);
