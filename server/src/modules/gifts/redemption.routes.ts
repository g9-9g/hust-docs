import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

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

export default router;
