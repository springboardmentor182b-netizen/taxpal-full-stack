// import { Schema, model, Document } from "mongoose";

// export interface ICategory extends Document {
//   name: string;
//   type: "income" | "expense";
//   user: Schema.Types.ObjectId;
// }

// const CategorySchema = new Schema<ICategory>(
//   {
//     name: { type: String, required: true, trim: true },
//     type: { type: String, enum: ["income", "expense"], required: true },
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true }
//   },
//   { timestamps: true }
// );

// export const Category = model<ICategory>("Category", CategorySchema);

import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  type: "income" | "expense";
  // Remove user or make it optional
  user?: Schema.Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    // Optional now
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", CategorySchema);

