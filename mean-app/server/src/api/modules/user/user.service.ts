import { User } from "./user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../../../utils/email";
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// REGISTER USER
export const registerUser = async (data: any) => {
  const { fullName, email, username, password, confirmPassword, country } = data;
  if (password !== confirmPassword) throw new Error("Passwords do not match");

  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    username,
    password: hashedPassword,
    country,
  });

  return user;
};

// LOGIN USER
export const loginUser = async (data: any) => {
  const { email, password } = data;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
};

// FORGOT PASSWORD (placeholder)
export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email not found");

  return { message: "enter your email id" };
};

// REQUEST RESET (send email to user)
export const generateResetToken = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email not found");

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  console.log("Generated token for user:", token);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
const html = `
  <p>Hello ${user.fullName},</p>
  <p>You requested a password reset. Click below to reset:</p>
  <a href="${resetLink}">${resetLink}</a>
  <p>Link expires in 1 hour.</p>
`;

await sendEmail(user.email, "Password Reset Request", html);
  return { message: "Password reset link sent to your email" };
};

// RESET PASSWORD
export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
  if (password !== confirmPassword) throw new Error("Passwords do not match");

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) throw new Error("Invalid or expired reset token");

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
  return { message: "Password reset successful" };
};
