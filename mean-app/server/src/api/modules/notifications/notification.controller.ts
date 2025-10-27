import { Request, Response } from "express";
import * as notificationService from "./notification.service";

export const createNotification = async (req: Request, res: Response) => {
    try {
        const notification = await notificationService.createNotification(req.body);
        (req as any).io.emit("notification", notification); // Emit real-time event
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.params.userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const markRead = async (req: Request, res: Response) => {
  try {
    const updated = await notificationService.markAsRead(req.params.id);
    res.json(updated);
  } catch (error) {
   res.status(500).json({ error: (error as Error).message });
  }
};
