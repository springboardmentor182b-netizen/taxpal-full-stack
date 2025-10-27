import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  type: "reminder" | "tax" | "general";
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["reminder", "tax", "general"], default: "general" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
