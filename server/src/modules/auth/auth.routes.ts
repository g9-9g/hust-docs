import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { HttpError } from '../../middlewares/error.middleware.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { verifyMicrosoftIdToken } from './microsoft-verify.js';
import type { User } from '@prisma/client';

const router = Router();

const microsoftSchema = z.object({
  idToken: z.string().min(20),
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

// Sinh username duy nhất từ prefix email: "nguyen.lm225522@..." -> "nguyen.lm225522" (thêm số nếu trùng).
async function deriveUniqueUsername(email: string): Promise<string> {
  const raw = email.split('@')[0] ?? 'user';
  // Lọc chỉ giữ ký tự cho phép bởi regex cũ ^[a-zA-Z0-9_.-]+$ và đảm bảo length 3-32.
  const base = raw.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 28) || 'user';
  let candidate = base.length < 3 ? `${base}user` : base;
  let suffix = 0;
  // Vòng tối đa ~1000 lần (đủ thực tế).
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    suffix += 1;
    candidate = `${base}${suffix}`.slice(0, 32);
    if (suffix > 999) {
      candidate = `${base}${Date.now()}`.slice(0, 32);
      break;
    }
  }
  return candidate;
}

router.post('/microsoft', async (req, res, next) => {
  try {
    const { idToken } = microsoftSchema.parse(req.body);
    const claims = await verifyMicrosoftIdToken(idToken);

    const expectedSuffix = `@${env.allowedEmailDomain.toLowerCase()}`;
    if (!claims.email.endsWith(expectedSuffix)) {
      throw new HttpError(403, `Email không thuộc ${expectedSuffix} — chỉ tài khoản HUST mới đăng nhập được.`);
    }

    // Ưu tiên match theo microsoftId (đã từng login), fallback theo email (tài khoản cũ migrate).
    let user = await prisma.user.findFirst({
      where: { OR: [{ microsoftId: claims.oid }, { email: claims.email }] },
    });

    if (user) {
      // Lần đầu liên kết Microsoft vào user cũ -> gắn microsoftId, đánh dấu verified.
      if (!user.microsoftId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { microsoftId: claims.oid, isVerified: true },
        });
      }
    } else {
      const username = await deriveUniqueUsername(claims.email);
      user = await prisma.user.create({
        data: {
          fullName: claims.name,
          username,
          email: claims.email,
          microsoftId: claims.oid,
          isVerified: true,
        },
      });
    }

    const accessToken = signToken(user.id, user.role);
    res.status(200).json({ accessToken, user: await serializeUser(user) });
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
