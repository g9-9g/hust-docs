import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { HttpError } from '../../middlewares/error.middleware.js';

const router = Router();

const subjectSelect = { id: true, name: true, code: true } satisfies Prisma.SubjectSelect;
const majorSelect = { id: true, name: true, code: true } satisfies Prisma.MajorSelect;
const uploaderSelect = {
  id: true,
  username: true,
  fullName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

const includeRefs = {
  uploader: { select: uploaderSelect },
  subject: { select: subjectSelect },
  major: { select: majorSelect },
} satisfies Prisma.DocumentInclude;

router.get('/me/profile', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(404, 'User not found');

    const giftIds = [user.equippedBadgeGiftId, user.equippedFrameGiftId].filter(
      (id): id is string => !!id,
    );
    const gifts = giftIds.length
      ? await prisma.gift.findMany({
          where: { id: { in: giftIds } },
          select: { id: true, name: true, icon: true, accentColor: true, frameGradient: true },
        })
      : [];
    const giftById = new Map(gifts.map((g) => [g.id, g]));
    const badge = user.equippedBadgeGiftId ? giftById.get(user.equippedBadgeGiftId) : undefined;
    const frame = user.equippedFrameGiftId ? giftById.get(user.equippedFrameGiftId) : undefined;

    const earned = await prisma.pointsTransaction.aggregate({
      _sum: { amount: true },
      where: { userId, amount: { gt: 0 } },
    });
    const achievedPoints = earned._sum.amount ?? 0;

    const docs = await prisma.document.findMany({
      where: { uploaderId: userId, status: { not: 'deleted' } },
      select: {
        downloadCount: true,
        upvoteCount: true,
        downvoteCount: true,
        viewCount: true,
        status: true,
      },
    });

    const stats = docs.reduce(
      (acc, d) => {
        acc.totalDocuments += 1;
        acc.totalDownloads += d.downloadCount;
        acc.totalUpvotes += d.upvoteCount;
        acc.totalDownvotes += d.downvoteCount;
        acc.totalViews += d.viewCount;
        if (d.status === 'public') acc.publicDocuments += 1;
        return acc;
      },
      {
        totalDocuments: 0,
        publicDocuments: 0,
        totalDownloads: 0,
        totalUpvotes: 0,
        totalDownvotes: 0,
        totalViews: 0,
      },
    );

    res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        studentId: user.studentId,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        contributionPoints: user.contributionPoints,
        achievedPoints,
        createdAt: user.createdAt,
        equippedBadge: badge
          ? { id: badge.id, name: badge.name, icon: badge.icon, accentColor: badge.accentColor }
          : null,
        equippedAvatarFrame: frame
          ? { id: frame.id, name: frame.name, frameGradient: frame.frameGradient }
          : null,
      },
      stats,
    });
  } catch (err) {
    next(err);
  }
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sort: z
    .enum(['latest', 'mostDownloaded', 'mostUpvoted', 'mostViewed'])
    .default('latest'),
});

router.get('/me/documents', requireAuth, async (req, res, next) => {
  try {
    const params = listQuerySchema.parse(req.query);
    const userId = req.user!.id;

    const where: Prisma.DocumentWhereInput = {
      uploaderId: userId,
      status: { not: 'deleted' },
    };

    const orderBy: Prisma.DocumentOrderByWithRelationInput[] =
      params.sort === 'mostDownloaded'
        ? [{ downloadCount: 'desc' }, { createdAt: 'desc' }]
        : params.sort === 'mostUpvoted'
          ? [{ upvoteCount: 'desc' }, { createdAt: 'desc' }]
          : params.sort === 'mostViewed'
            ? [{ viewCount: 'desc' }, { createdAt: 'desc' }]
            : [{ createdAt: 'desc' }];

    const skip = (params.page - 1) * params.limit;
    const [items, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
        include: includeRefs,
      }),
      prisma.document.count({ where }),
    ]);

    res.json({
      items,
      page: params.page,
      limit: params.limit,
      total,
      hasMore: skip + items.length < total,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
