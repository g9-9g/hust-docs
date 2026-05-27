import { Router } from 'express';
import { prisma } from '../../config/prisma.js';
import { isObjectId } from '../documents/document.model.js';
import { HttpError } from '../../middlewares/error.middleware.js';

const router = Router();

const majorSelect = { id: true, name: true, code: true } as const;

router.get('/majors', async (_req, res, next) => {
  try {
    const items = await prisma.major.findMany({ orderBy: { name: 'asc' } });
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.get('/subjects', async (req, res, next) => {
  try {
    const { majorId, q } = req.query as { majorId?: string; q?: string };
    const ci = q?.trim() ? { contains: q.trim(), mode: 'insensitive' as const } : undefined;

    const subjects = await prisma.subject.findMany({
      where: {
        ...(majorId && isObjectId(majorId) ? { majorId } : {}),
        ...(ci ? { OR: [{ name: ci }, { code: ci }] } : {}),
      },
      orderBy: { name: 'asc' },
      take: 500,
      include: { major: { select: majorSelect } },
    });

    // Tổng hợp số tài liệu công khai và tổng lượt tải theo từng môn trong một truy vấn.
    const stats = await prisma.document.groupBy({
      by: ['subjectId'],
      where: { status: 'public', subjectId: { in: subjects.map((s) => s.id) } },
      _count: { _all: true },
      _sum: { downloadCount: true },
    });
    const statBySubject = new Map(
      stats.map((s) => [
        s.subjectId,
        { documentCount: s._count._all, downloadCount: s._sum.downloadCount ?? 0 },
      ]),
    );

    res.json({
      items: subjects.map((s) => {
        const stat = statBySubject.get(s.id);
        return {
          id: s.id,
          code: s.code,
          name: s.name,
          majorId: s.majorId,
          major: s.major,
          documentCount: stat?.documentCount ?? 0,
          downloadCount: stat?.downloadCount ?? 0,
        };
      }),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/subjects/:id', async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) throw new HttpError(400, 'Invalid id');

    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
      include: { major: { select: majorSelect } },
    });
    if (!subject) throw new HttpError(404, 'Subject not found');

    // Thống kê theo tài liệu công khai để khớp với danh sách hiển thị trên trang chi tiết.
    const agg = await prisma.document.aggregate({
      where: { subjectId: subject.id, status: 'public' },
      _count: { _all: true },
      _sum: { downloadCount: true },
    });

    res.json({
      subject: {
        id: subject.id,
        code: subject.code,
        name: subject.name,
        majorId: subject.majorId,
        major: subject.major,
        documentCount: agg._count._all,
        downloadCount: agg._sum.downloadCount ?? 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
