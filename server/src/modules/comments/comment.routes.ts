import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma.js';
import { isObjectId } from '../documents/document.model.js';
import { requireAuth, optionalAuth } from '../../middlewares/auth.middleware.js';
import { HttpError } from '../../middlewares/error.middleware.js';

const router = Router({ mergeParams: true });

const userSelect = {
  id: true,
  username: true,
  fullName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

const listQuerySchema = z.object({
  sort: z.enum(['newest', 'oldest']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const createSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Bình luận không được để trống')
    .max(1000, 'Bình luận tối đa 1000 ký tự'),
  parentId: z.string().optional(),
});

type CommentWithUser = Prisma.CommentGetPayload<{
  include: { user: { select: typeof userSelect } };
}>;

const DELETED_PLACEHOLDER = '[Bình luận đã bị xóa]';

function serialize(c: CommentWithUser, viewerId: string | null, isAdmin: boolean) {
  const isDeleted = c.deletedAt !== null;
  return {
    id: c.id,
    content: isDeleted ? DELETED_PLACEHOLDER : c.content,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    parentId: c.parentId,
    user: c.user,
    isDeleted,
    canDelete: !isDeleted && (isAdmin || (viewerId !== null && c.userId === viewerId)),
  };
}

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { documentId } = req.params as { documentId: string };
    if (!isObjectId(documentId)) throw new HttpError(400, 'Invalid id');

    const doc = await prisma.document.findFirst({
      where: { id: documentId, status: 'public' },
      select: { id: true },
    });
    if (!doc) throw new HttpError(404, 'Document not found');

    const params = listQuerySchema.parse(req.query);
    const skip = (params.page - 1) * params.limit;
    const orderBy: Prisma.CommentOrderByWithRelationInput = {
      createdAt: params.sort === 'oldest' ? 'asc' : 'desc',
    };

    const whereTop: Prisma.CommentWhereInput = { documentId, parentId: null };

    // Đếm "non-deleted" qua phép trừ để robust với rows cũ không có field deletedAt
    // (Prisma+Mongo không match `deletedAt: null` cho field missing).
    const [topRows, topTotal, allTotal, deletedTotal] = await Promise.all([
      prisma.comment.findMany({
        where: whereTop,
        orderBy,
        skip,
        take: params.limit,
        include: { user: { select: userSelect } },
      }),
      prisma.comment.count({ where: whereTop }),
      prisma.comment.count({ where: { documentId } }),
      prisma.comment.count({ where: { documentId, deletedAt: { not: null } } }),
    ]);
    const total = allTotal - deletedTotal;

    const topIds = topRows.map((c) => c.id);
    const replyRows = topIds.length
      ? await prisma.comment.findMany({
          where: { parentId: { in: topIds } },
          orderBy: { createdAt: 'asc' },
          include: { user: { select: userSelect } },
        })
      : [];

    const viewerId = req.user?.id ?? null;
    const isAdmin = req.user?.role === 'admin';

    const repliesByParent = new Map<string, ReturnType<typeof serialize>[]>();
    for (const r of replyRows) {
      if (!r.parentId) continue;
      const arr = repliesByParent.get(r.parentId) ?? [];
      arr.push(serialize(r, viewerId, isAdmin));
      repliesByParent.set(r.parentId, arr);
    }

    const items = topRows.map((c) => ({
      ...serialize(c, viewerId, isAdmin),
      replies: repliesByParent.get(c.id) ?? [],
    }));

    res.json({
      items,
      page: params.page,
      limit: params.limit,
      total,
      hasMore: skip + items.length < topTotal,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { documentId } = req.params as { documentId: string };
    if (!isObjectId(documentId)) throw new HttpError(400, 'Invalid id');

    const doc = await prisma.document.findFirst({
      where: { id: documentId, status: 'public' },
      select: { id: true },
    });
    if (!doc) throw new HttpError(404, 'Document not found');

    const { content, parentId } = createSchema.parse(req.body);

    let resolvedParentId: string | null = null;
    if (parentId) {
      if (!isObjectId(parentId)) throw new HttpError(400, 'Invalid parentId');
      const parent = await prisma.comment.findFirst({
        where: { id: parentId, documentId },
        select: { id: true, parentId: true, deletedAt: true },
      });
      if (!parent) throw new HttpError(404, 'Parent comment not found');
      if (parent.deletedAt) throw new HttpError(410, 'Parent comment has been deleted');
      // Chỉ cho phép trả lời 1 cấp: nếu parent đã là reply, gắn vào ông của nó.
      resolvedParentId = parent.parentId ?? parent.id;
    }

    const created = await prisma.comment.create({
      data: {
        documentId,
        userId: req.user!.id,
        parentId: resolvedParentId,
        content,
      },
      include: { user: { select: userSelect } },
    });

    res.status(201).json({
      comment: { ...serialize(created, req.user!.id, req.user!.role === 'admin'), replies: [] },
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:commentId', requireAuth, async (req, res, next) => {
  try {
    const { documentId, commentId } = req.params as {
      documentId: string;
      commentId: string;
    };
    if (!isObjectId(documentId) || !isObjectId(commentId)) {
      throw new HttpError(400, 'Invalid id');
    }

    const comment = await prisma.comment.findFirst({
      where: { id: commentId, documentId },
      select: { id: true, userId: true, parentId: true, deletedAt: true },
    });
    if (!comment) throw new HttpError(404, 'Comment not found');
    if (comment.deletedAt) throw new HttpError(410, 'Comment already deleted');

    const isOwner = comment.userId === req.user!.id;
    const isAdmin = req.user!.role === 'admin';
    if (!isOwner && !isAdmin) throw new HttpError(403, 'Forbidden');

    // Soft delete: giữ row để thread reply còn ngữ cảnh; total chỉ đếm row chưa xóa.
    await prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
