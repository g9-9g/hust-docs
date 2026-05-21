import { Router } from 'express';
import { z } from 'zod';
import { Prisma, GiftType } from '@prisma/client';
import { prisma } from '../../config/prisma.js';
import { requireAuth, optionalAuth } from '../../middlewares/auth.middleware.js';
import { HttpError } from '../../middlewares/error.middleware.js';
import { isObjectId } from '../documents/document.model.js';

const router = Router();

const giftSelect = {
  id: true,
  name: true,
  description: true,
  type: true,
  pointsCost: true,
  stock: true,
  status: true,
  icon: true,
  accentColor: true,
  frameGradient: true,
  imageUrl: true,
} satisfies Prisma.GiftSelect;

const COSMETIC_TYPES: GiftType[] = [GiftType.BADGE, GiftType.AVATAR_FRAME];
const isCosmetic = (type: GiftType) => COSMETIC_TYPES.includes(type);

// GET /api/gifts — danh sách quà; kèm dữ liệu cá nhân nếu đã đăng nhập.
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const gifts = await prisma.gift.findMany({
      where: { status: { not: 'hidden' } },
      orderBy: [{ pointsCost: 'asc' }, { createdAt: 'asc' }],
      select: giftSelect,
    });

    if (!req.user) {
      res.json({
        gifts,
        balance: null,
        ownedGiftIds: [],
        equippedBadgeGiftId: null,
        equippedFrameGiftId: null,
      });
      return;
    }

    const [user, redemptions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          contributionPoints: true,
          equippedBadgeGiftId: true,
          equippedFrameGiftId: true,
        },
      }),
      prisma.giftRedemption.findMany({
        where: { userId: req.user.id, giftType: { in: COSMETIC_TYPES } },
        select: { giftId: true },
      }),
    ]);

    res.json({
      gifts,
      balance: user?.contributionPoints ?? 0,
      ownedGiftIds: [...new Set(redemptions.map((r) => r.giftId))],
      equippedBadgeGiftId: user?.equippedBadgeGiftId ?? null,
      equippedFrameGiftId: user?.equippedFrameGiftId ?? null,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/gifts/:id/redeem — đổi quà.
router.post('/:id/redeem', requireAuth, async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) throw new HttpError(400, 'Invalid id');
    const userId = req.user!.id;

    const gift = await prisma.gift.findUnique({
      where: { id: req.params.id },
      select: giftSelect,
    });
    if (!gift) throw new HttpError(404, 'Không tìm thấy quà');
    if (gift.status !== 'active') throw new HttpError(409, 'Quà hiện không thể đổi');
    if (gift.stock !== null && gift.stock <= 0) throw new HttpError(409, 'Quà đã hết hàng');

    // Cosmetic chỉ sở hữu một lần.
    if (isCosmetic(gift.type)) {
      const owned = await prisma.giftRedemption.findFirst({
        where: { userId, giftId: gift.id },
        select: { id: true },
      });
      if (owned) throw new HttpError(409, 'Bạn đã sở hữu quà này');
    }

    // 1. Trừ điểm theo điều kiện (atomic) — chống trừ 2 lần.
    const deducted = await prisma.user.updateMany({
      where: { id: userId, contributionPoints: { gte: gift.pointsCost } },
      data: { contributionPoints: { decrement: gift.pointsCost } },
    });
    if (deducted.count === 0) throw new HttpError(400, 'Bạn không đủ điểm để đổi quà này');

    // 2. Trừ tồn kho nếu có giới hạn; thất bại thì hoàn điểm.
    if (gift.stock !== null) {
      const stockTaken = await prisma.gift.updateMany({
        where: { id: gift.id, stock: { gt: 0 } },
        data: { stock: { decrement: 1 } },
      });
      if (stockTaken.count === 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { contributionPoints: { increment: gift.pointsCost } },
        });
        throw new HttpError(409, 'Quà đã hết hàng');
      }
    }

    // 3. Bản ghi đổi quà.
    const redemption = await prisma.giftRedemption.create({
      data: {
        userId,
        giftId: gift.id,
        giftName: gift.name,
        giftType: gift.type,
        pointsSpent: gift.pointsCost,
        status: isCosmetic(gift.type) ? 'completed' : 'pending',
      },
    });

    // 4. Giao dịch điểm (âm).
    await prisma.pointsTransaction.create({
      data: {
        userId,
        amount: -gift.pointsCost,
        reason: 'REDEEM_REWARD',
        note: `Đổi quà: ${gift.name}`,
      },
    });

    // 5. Cosmetic → tự trang bị.
    let equippedBadgeGiftId: string | null | undefined;
    let equippedFrameGiftId: string | null | undefined;
    if (gift.type === 'BADGE') {
      ({ equippedBadgeGiftId, equippedFrameGiftId } = await prisma.user.update({
        where: { id: userId },
        data: { equippedBadgeGiftId: gift.id },
        select: { equippedBadgeGiftId: true, equippedFrameGiftId: true },
      }));
    } else if (gift.type === 'AVATAR_FRAME') {
      ({ equippedBadgeGiftId, equippedFrameGiftId } = await prisma.user.update({
        where: { id: userId },
        data: { equippedFrameGiftId: gift.id },
        select: { equippedBadgeGiftId: true, equippedFrameGiftId: true },
      }));
    } else {
      const u = await prisma.user.findUnique({
        where: { id: userId },
        select: { equippedBadgeGiftId: true, equippedFrameGiftId: true },
      });
      equippedBadgeGiftId = u?.equippedBadgeGiftId ?? null;
      equippedFrameGiftId = u?.equippedFrameGiftId ?? null;
    }

    const balanceRow = await prisma.user.findUnique({
      where: { id: userId },
      select: { contributionPoints: true },
    });

    res.status(201).json({
      redemption,
      balance: balanceRow?.contributionPoints ?? 0,
      equippedBadgeGiftId: equippedBadgeGiftId ?? null,
      equippedFrameGiftId: equippedFrameGiftId ?? null,
    });
  } catch (err) {
    next(err);
  }
});

const equipSchema = z.object({
  giftId: z.string().nullable(),
  slot: z.enum(['badge', 'frame']),
});

// POST /api/gifts/equip — bật/tắt trang bị cosmetic đã sở hữu.
router.post('/equip', requireAuth, async (req, res, next) => {
  try {
    const { giftId, slot } = equipSchema.parse(req.body);
    const userId = req.user!.id;

    if (giftId !== null) {
      if (!isObjectId(giftId)) throw new HttpError(400, 'Invalid giftId');
      const owned = await prisma.giftRedemption.findFirst({
        where: { userId, giftId },
        select: { giftType: true },
      });
      if (!owned) throw new HttpError(403, 'Bạn chưa sở hữu quà này');
      const expected = slot === 'badge' ? 'BADGE' : 'AVATAR_FRAME';
      if (owned.giftType !== expected) {
        throw new HttpError(400, 'Loại quà không khớp vị trí trang bị');
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: slot === 'badge' ? { equippedBadgeGiftId: giftId } : { equippedFrameGiftId: giftId },
      select: { equippedBadgeGiftId: true, equippedFrameGiftId: true },
    });

    res.json({
      equippedBadgeGiftId: user.equippedBadgeGiftId,
      equippedFrameGiftId: user.equippedFrameGiftId,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
