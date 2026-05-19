import { Router } from 'express';
import { prisma } from '../../config/prisma.js';

const router = Router();

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
    const items = await prisma.subject.findMany({
      where: {
        ...(majorId ? { majorId } : {}),
        ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
      },
      orderBy: { name: 'asc' },
      take: 200,
    });
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

export default router;
