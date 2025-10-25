import mongoose, { Schema, Document } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export interface IUser extends Document {
  fullName: string;
  email: string;
  username: string;
  password: string;
  country: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}
const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});
export const User = mongoose.model<IUser>("User", userSchema);
