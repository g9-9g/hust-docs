import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { HttpError } from '../../middlewares/error.middleware.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import type { User } from '@prisma/client';

const router = Router();

const registerSchema = z.object({
  fullName: z.string().min(2).max(80),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_.-]+$/),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  emailOrUsername: z.string().min(3),
  password: z.string().min(1),
});

function signToken(id: string, role: string) {
  return jwt.sign({ id, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

// Resolve cosmetic đang trang bị + các field công khai để client render Header.
async function serializeUser(u: User) {
  const giftIds = [u.equippedBadgeGiftId, u.equippedFrameGiftId].filter(
    (id): id is string => !!id,
  );
  const gifts = giftIds.length
    ? await prisma.gift.findMany({
        where: { id: { in: giftIds } },
        select: { id: true, name: true, icon: true, accentColor: true, frameGradient: true },
      })
    : [];
  const giftById = new Map(gifts.map((g) => [g.id, g]));
  const badge = u.equippedBadgeGiftId ? giftById.get(u.equippedBadgeGiftId) : undefined;
  const frame = u.equippedFrameGiftId ? giftById.get(u.equippedFrameGiftId) : undefined;

  return {
    id: u.id,
    fullName: u.fullName,
    username: u.username,
    email: u.email,
    role: u.role,
    avatarUrl: u.avatarUrl,
    contributionPoints: u.contributionPoints,
    isVerified: u.isVerified,
    equippedBadge: badge
      ? { id: badge.id, name: badge.name, icon: badge.icon, accentColor: badge.accentColor }
      : null,
    equippedAvatarFrame: frame
      ? { id: frame.id, name: frame.name, frameGradient: frame.frameGradient }
      : null,
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const email = data.email.toLowerCase();
    const username = data.username.toLowerCase();
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (exists) throw new HttpError(409, 'Email or username already exists');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        username,
        email,
        passwordHash,
      },
    });
    const accessToken = signToken(user.id, user.role);
    res.status(201).json({ accessToken, user: await serializeUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const ident = data.emailOrUsername.toLowerCase();
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: ident }, { username: ident }] },
    });
    if (!user) throw new HttpError(401, 'Invalid credentials');
    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) throw new HttpError(401, 'Invalid credentials');
    const accessToken = signToken(user.id, user.role);
    res.json({ accessToken, user: await serializeUser(user) });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new HttpError(404, 'User not found');
    res.json({ user: await serializeUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
