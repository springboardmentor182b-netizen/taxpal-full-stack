import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  type: "expense" | "income";
  createdBy: string;
  createdAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["expense", "income"], required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<ICategory>("Category", categorySchema);
