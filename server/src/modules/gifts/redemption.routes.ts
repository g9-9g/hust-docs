import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { HttpError } from '../../middlewares/error.middleware.js';
import { isObjectId } from '../documents/document.model.js';

const router = Router();

const USABLE_TYPES = ['VOUCHER'] as const;

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// GET /api/redemptions/me — lịch sử đổi quà của user, phân trang.
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const params = listQuerySchema.parse(req.query);
    const userId = req.user!.id;
    const skip = (params.page - 1) * params.limit;

    const [redemptions, total] = await Promise.all([
      prisma.giftRedemption.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: params.limit,
      }),
      prisma.giftRedemption.count({ where: { userId } }),
    ]);

    res.json({
      redemptions: redemptions.map((r) => ({
        id: r.id,
        giftId: r.giftId,
        giftName: r.giftName,
        giftType: r.giftType,
        pointsSpent: r.pointsSpent,
        status: r.status,
        usedAt: r.usedAt,
        createdAt: r.createdAt,
      })),
      page: params.page,
      limit: params.limit,
      total,
      hasMore: skip + redemptions.length < total,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/redemptions/:id/use — đánh dấu voucher đã sử dụng.
router.post('/:id/use', requireAuth, async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) throw new HttpError(400, 'Invalid id');
    const userId = req.user!.id;

    const redemption = await prisma.giftRedemption.findUnique({
      where: { id: req.params.id },
    });
    if (!redemption || redemption.userId !== userId) {
      throw new HttpError(404, 'Không tìm thấy quà');
    }
    if (!USABLE_TYPES.includes(redemption.giftType as (typeof USABLE_TYPES)[number])) {
      throw new HttpError(400, 'Quà này không thể đánh dấu sử dụng');
    }
    if (redemption.usedAt) {
      throw new HttpError(409, 'Quà đã được sử dụng');
    }

    const updated = await prisma.giftRedemption.update({
      where: { id: redemption.id },
      data: { usedAt: new Date() },
    });

    res.json({
      id: updated.id,
      giftId: updated.giftId,
      giftName: updated.giftName,
      giftType: updated.giftType,
      pointsSpent: updated.pointsSpent,
      status: updated.status,
      usedAt: updated.usedAt,
      createdAt: updated.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
