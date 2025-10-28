import { Request, Response } from "express";
import { registerUser, loginUser, forgotPassword, generateResetToken, resetPassword } from "./user.service";
import dotenv from 'dotenv';
dotenv.config();
// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: "Account created successfully. Please log in to continue.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        country: user.country,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        country: user.country,
      },
      token,
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

// FORGOT PASSWORD (placeholder)
export const forgot = async (req: Request, res: Response) => {
  try {
    const response = await forgotPassword(req.body.email);
    res.status(200).json(response);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// REQUEST RESET
export const requestReset = async (req: Request, res: Response) => {
  try {
    const response = await generateResetToken(req.body.email);
    res.status(200).json(response);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// RESET PASSWORD
export const reset = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const { newPassword, confirmPassword } = req.body;

    const response = await resetPassword(token, newPassword, confirmPassword);
    res.status(200).json(response);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
