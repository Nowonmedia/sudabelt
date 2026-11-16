import mongoose, { Document, Schema } from 'mongoose';

export type RFQStatus = 'pending' | 'quoted' | 'closed';

export interface ISelectedRFQItem {
  equipmentId?: string;
  sku?: string;
  name: string;
  category?: string;
  quantity: number;
  notes?: string;
}

export interface IRFQLocation {
  city: string;
  state: string;
  country?: string;
}

export interface IRFQContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface IRFQ extends Document {
  referenceId: string;
  facilityName: string;
  facilityType: string;
  location: IRFQLocation;
  urgency: string;
  selectedItems: ISelectedRFQItem[];
  slaTier: string;
  contact: IRFQContact;
  tenderAttachmentUrl?: string;
  additionalNotes?: string;
  status: RFQStatus;
  createdAt: Date;
  updatedAt: Date;
}

const generateRFQReferenceId = (): string => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  return `SBM-RFQ-${yearSuffix}${randomDigits}`;
};

const SelectedRFQItemSchema = new Schema<ISelectedRFQItem>(
  {
    equipmentId: { type: String, trim: true },
    sku: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const RFQSchema = new Schema<IRFQ>(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: generateRFQReferenceId,
    },
    facilityName: { type: String, required: true, trim: true },
    facilityType: { type: String, required: true, trim: true },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, trim: true, default: 'Nigeria' },
    },
    urgency: { type: String, required: true, trim: true },
    selectedItems: {
      type: [SelectedRFQItemSchema],
      required: true,
      validate: [
        (val: ISelectedRFQItem[]) => val.length > 0,
        'At least one item must be included in an RFQ.',
      ],
    },
    slaTier: {
      type: String,
      required: true,
      trim: true,
      default: 'Standard Turnkey + 12-Month Preventive SLA',
    },
    contact: {
      name: { type: String, required: true, trim: true },
      role: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
    },
    tenderAttachmentUrl: { type: String, trim: true },
    additionalNotes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'quoted', 'closed'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

export const RFQ = mongoose.model<IRFQ>('RFQ', RFQSchema);
