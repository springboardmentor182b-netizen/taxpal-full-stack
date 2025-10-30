import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  normalizedName: string;
  type: 'income' | 'expense';
  user?: Schema.Types.ObjectId | null; // optional
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    normalizedName: { type: String, required: true, lowercase: true, trim: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    // default null makes the unique index deterministic when user isn't used
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

function normalize(n?: string) {
  return (n ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

CategorySchema.pre('validate', function (next) {
  if (this.name) this.normalizedName = normalize(this.name);
  next();
});

// (normalizedName, type, user) must be unique
CategorySchema.index(
  { normalizedName: 1, type: 1, user: 1 },
  { unique: true, name: 'uniq_category_name_type_user' }
);

export const Category = model<ICategory>('Category', CategorySchema);
