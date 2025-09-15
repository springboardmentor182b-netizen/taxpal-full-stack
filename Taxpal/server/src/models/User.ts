import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  country: string;
  income_bracket: 'low' | 'middle' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  country: {
    type: String,
    required: true,
    default: 'US'
  },
  income_bracket: {
    type: String,
    enum: ['low', 'middle', 'high'],
    required: true,
    default: 'middle'
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
