import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  dateOfBirth: Date;
  googleId?: string;
  otp?: string;
  otpExpires?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  googleId: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
});

export const User = model<IUser>('User', userSchema);