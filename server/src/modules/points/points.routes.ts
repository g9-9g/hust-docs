import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const params = listQuerySchema.parse(req.query);
    const userId = req.user!.id;
    const skip = (params.page - 1) * params.limit;

    const [user, transactions, total] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { contributionPoints: true },
      }),
      prisma.pointsTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: params.limit,
      }),
      prisma.pointsTransaction.count({ where: { userId } }),
    ]);

    const docIds = [
      ...new Set(transactions.map((t) => t.documentId).filter((id): id is string => !!id)),
    ];
    const docs = docIds.length
      ? await prisma.document.findMany({
          where: { id: { in: docIds } },
          select: { id: true, title: true },
        })
      : [];
    const titleById = new Map(docs.map((d) => [d.id, d.title]));

    res.json({
      balance: user?.contributionPoints ?? 0,
      transactions: transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        reason: t.reason,
        documentId: t.documentId,
        documentTitle: t.documentId ? (titleById.get(t.documentId) ?? null) : null,
        createdAt: t.createdAt,
      })),
      page: params.page,
      limit: params.limit,
      total,
      hasMore: skip + transactions.length < total,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
