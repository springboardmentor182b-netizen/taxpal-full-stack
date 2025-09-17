import { Router } from "express";
import { register, login, forgot, requestReset, reset } from "./user.controller";
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgot);

// Password reset routes
router.post("/request-reset", requestReset);
router.post("/reset-password/:token", reset);

export default router;
