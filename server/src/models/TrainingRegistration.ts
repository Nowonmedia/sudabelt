import mongoose, { Document, Schema } from 'mongoose';

export type TrainingRegistrationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ITrainingRegistration extends Document {
  registrationId: string;
  institutionName: string;
  courseTrack: string;
  numberOfTrainees: number;
  targetHospitalState: string;
  contactName: string;
  contactRole: string;
  email: string;
  phone: string;
  preferredDates?: string;
  notes?: string;
  status: TrainingRegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const generateTrainingId = (): string => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  return `SBM-TRN-${yearSuffix}${randomDigits}`;
};

const TrainingRegistrationSchema = new Schema<ITrainingRegistration>(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: generateTrainingId,
    },
    institutionName: { type: String, required: true, trim: true },
    courseTrack: { type: String, required: true, trim: true },
    numberOfTrainees: { type: Number, required: true, min: 1 },
    targetHospitalState: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    contactRole: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    preferredDates: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

export const TrainingRegistration = mongoose.model<ITrainingRegistration>(
  'TrainingRegistration',
  TrainingRegistrationSchema
);
