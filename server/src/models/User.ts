import mongoose, { Document, Schema } from 'mongoose';

export type AdminUserRole = 'superadmin' | 'admin' | 'editor';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminUserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, default: 'Sudabelt Administrator' },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'editor'],
      default: 'admin',
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
