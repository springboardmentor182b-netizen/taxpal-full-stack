import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from './user.model';

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  country?: string;
  income_bracket?: 'low' | 'middle' | 'high';
};

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const RESET_WINDOW_MS = 30 * 60 * 1000;

function toPublic(u: any): PublicUser {
  return {
    id: String(u._id ?? u.id),
    name: u.name,
    email: u.email,
    country: u.country,
    income_bracket: u.income_bracket,
  };
}

function sign(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

async function hashPassword(pw: string) { return bcrypt.hash(pw, 12); }
async function comparePassword(pw: string, hash: string) { return bcrypt.compare(pw, hash); }

export const authService = {
  async register(input: {
    name: string; email: string; password: string;
    country?: string; income_bracket?: 'low' | 'middle' | 'high';
  }): Promise<{ token: string; user: PublicUser }> {
    const { name, email, password, country, income_bracket } = input;
    const existing = await User.findOne({ email });
    if (existing) throw new Error('USER_EXISTS');
    const hashed = await hashPassword(password);
    const user = await User.create({
      name, email, password: hashed,
      country: country || 'US',
      income_bracket: income_bracket || 'middle',
    });
    const token = sign(user._id.toString());
    return { token, user: toPublic(user) };
  },

  async login(email: string, password: string): Promise<{ token: string; user: PublicUser } | null> {
    const user = await User.findOne({ email });
    if (!user) return null;
    const ok = await comparePassword(password, user.password);
    if (!ok) return null;
    const token = sign(user._id.toString());
    return { token, user: toPublic(user) };
  },

  async issueResetToken(email: string): Promise<{ user: PublicUser; resetToken: string } | null> {
    const user = await User.findOne({ email });
    if (!user) return null;

    const resetToken = crypto.randomBytes(32).toString('hex');
    (user as any).resetPasswordToken = resetToken;
    (user as any).resetPasswordExpires = new Date(Date.now() + RESET_WINDOW_MS);
    await user.save();

    return { user: toPublic(user), resetToken };
  },

  async resetPassword(resetToken: string, newPassword: string): Promise<{ token: string; user: PublicUser } | null> {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: new Date() },
    } as any);

    if (!user) return null;

    (user as any).password = await hashPassword(newPassword);
    (user as any).resetPasswordToken = undefined;
    (user as any).resetPasswordExpires = undefined;
    await user.save();

    const token = sign(user._id.toString());
    return { token, user: toPublic(user) };
  },

  async getPublicById(id: string): Promise<PublicUser | null> {
    const user = await User.findById(id).select('-password').lean();
    return user ? toPublic(user) : null;
  },

  // ========= NEW: updateProfile =========
  async updateProfile(
    id: string,
    input: Partial<{ name: string; email: string; country: string; income_bracket: 'low' | 'middle' | 'high' }>
  ): Promise<PublicUser> {
    const payload: any = {};

    if (typeof input.name === 'string' && input.name.trim()) {
      payload.name = input.name.trim();
    }

    if (typeof input.country === 'string') {
      payload.country = input.country.trim();
    }

    if (input.income_bracket) {
      const ok = ['low', 'middle', 'high'].includes(input.income_bracket);
      if (!ok) throw new Error('Invalid income_bracket');
      payload.income_bracket = input.income_bracket;
    }

    if (typeof input.email === 'string' && input.email.trim()) {
      const email = input.email.trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Invalid email format');
      // Make sure the new email is not used by another user
      const exists = await User.findOne({ email, _id: { $ne: id } }).lean();
      if (exists) throw new Error('Email already in use');
      payload.email = email;
    }

    const updated = await User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      context: 'query',
    }).lean();

    if (!updated) throw new Error('User not found');
    return toPublic(updated);
  },
};
