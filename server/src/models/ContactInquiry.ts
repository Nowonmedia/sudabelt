import mongoose, { Document, Schema } from 'mongoose';

export type InquiryDepartment = 'sales' | 'biomedical_sla' | 'training' | 'general';

export type InquiryStatus = 'new' | 'responded' | 'archived';

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  facilityName?: string;
  department: InquiryDepartment;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    facilityName: { type: String, trim: true },
    department: {
      type: String,
      enum: ['sales', 'biomedical_sla', 'training', 'general'],
      required: true,
      default: 'general',
      index: true,
    },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'responded', 'archived'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true }
);

export const ContactInquiry = mongoose.model<IContactInquiry>(
  'ContactInquiry',
  ContactInquirySchema
);
