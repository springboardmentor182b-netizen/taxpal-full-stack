import { Request, Response } from "express";
import * as reminderService from "./taxReminder.service";
import { AuthRequest } from "../../middlewares/auth";

export const getUserReminders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const reminders = await reminderService.getRemindersByUser(req.user.id);
    res.status(200).json(reminders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReminder = async (req: Request, res: Response) => {
  try {
    const updated = await reminderService.updateReminderStatus(
      req.params.id,
      req.body.status
    );
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
