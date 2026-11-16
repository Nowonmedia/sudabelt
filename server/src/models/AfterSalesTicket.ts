import mongoose, { Document, Schema } from 'mongoose';

export type TicketIssueType =
  | 'breakdown'
  | 'preventive_maintenance'
  | 'calibration'
  | 'consumable_stockout';

export type TicketUrgencyLevel = 'critical_patient_impact' | 'moderate' | 'routine';

export type TicketStatus = 'open' | 'dispatched' | 'in_progress' | 'resolved' | 'closed';

export interface IAfterSalesTicket extends Document {
  ticketId: string;
  hospitalName: string;
  equipmentModel: string;
  serialNumber: string;
  issueType: TicketIssueType;
  urgencyLevel: TicketUrgencyLevel;
  description: string;
  contactName: string;
  email?: string;
  phone: string;
  locationState?: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}

const generateTicketId = (): string => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  return `SBM-SRV-${yearSuffix}${randomDigits}`;
};

const AfterSalesTicketSchema = new Schema<IAfterSalesTicket>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: generateTicketId,
    },
    hospitalName: { type: String, required: true, trim: true },
    equipmentModel: { type: String, required: true, trim: true },
    serialNumber: { type: String, required: true, trim: true },
    issueType: {
      type: String,
      enum: ['breakdown', 'preventive_maintenance', 'calibration', 'consumable_stockout'],
      required: true,
      index: true,
    },
    urgencyLevel: {
      type: String,
      enum: ['critical_patient_impact', 'moderate', 'routine'],
      required: true,
      default: 'moderate',
      index: true,
    },
    description: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    locationState: { type: String, trim: true },
    status: {
      type: String,
      enum: ['open', 'dispatched', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
  },
  { timestamps: true }
);

export const AfterSalesTicket = mongoose.model<IAfterSalesTicket>(
  'AfterSalesTicket',
  AfterSalesTicketSchema
);
