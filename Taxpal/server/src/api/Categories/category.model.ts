import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  type: 'income' | 'expense';
  user?: Schema.Types.ObjectId; // optional
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' } // optional
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', CategorySchema);
