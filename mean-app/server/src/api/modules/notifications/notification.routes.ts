import { Router} from "express";
import * as notificationController from "./notification.controller";
import { auth } from "../../middlewares/auth";
const router = Router();

router.post("/",auth,notificationController.createNotification);
router.get("/:userId",auth, notificationController.getNotifications);
router.put("/:id/read",auth, notificationController.markRead);

export default router;
