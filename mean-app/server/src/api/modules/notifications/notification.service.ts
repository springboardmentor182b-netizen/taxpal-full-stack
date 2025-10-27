import { Notification } from "./notification.model";

export const createNotification = async (data: any) => {
  const notification = await Notification.create(data);
  return notification;
};

export const getUserNotifications = async (userId: string) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

export const markAsRead = async (id: string) => {
  return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
};
