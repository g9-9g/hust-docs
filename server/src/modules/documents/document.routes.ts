import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { z } from 'zod';

const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip') as typeof import('adm-zip');

function mimeFromPath(p: string): string {
  const ext = path.extname(p).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}
import { Prisma, DocumentCategory } from '@prisma/client';
import { prisma } from '../../config/prisma.js';
import { isObjectId } from './document.model.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { requireAuth, optionalAuth } from '../../middlewares/auth.middleware.js';
import { HttpError } from '../../middlewares/error.middleware.js';
import { convertOfficeToPdf, shouldConvertToPdf } from './convert.js';

const router = Router();

const uploaderSelect = {
  id: true,
  username: true,
  fullName: true,
  avatarUrl: true,
  isVerified: true,
} satisfies Prisma.UserSelect;

const subjectSelect = { id: true, name: true, code: true } satisfies Prisma.SubjectSelect;
const majorSelect = { id: true, name: true, code: true } satisfies Prisma.MajorSelect;

const includeRefs = {
  uploader: { select: uploaderSelect },
  subject: { select: subjectSelect },
  major: { select: majorSelect },
} satisfies Prisma.DocumentInclude;

const listQuerySchema = z.object({
  q: z.string().trim().optional(),
  subjectId: z.string().optional(),
  majorId: z.string().optional(),
  category: z.nativeEnum(DocumentCategory).optional(),
  tag: z.string().optional(),
  sort: z.enum(['latest', 'mostDownloaded', 'mostUpvoted']).default('latest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const params = listQuerySchema.parse(req.query);

    const where: Prisma.DocumentWhereInput = { status: 'public' };
    if (params.subjectId && isObjectId(params.subjectId)) where.subjectId = params.subjectId;
    if (params.majorId && isObjectId(params.majorId)) where.majorId = params.majorId;
    if (params.category) where.category = params.category;
    if (params.tag) where.tags = { has: params.tag };
    if (params.q) {
      const ci = { contains: params.q, mode: 'insensitive' as const };
      where.OR = [
        { title: ci },
        { description: ci },
        { teacherName: ci },
        { tags: { has: params.q } },
      ];
    }

    const orderBy: Prisma.DocumentOrderByWithRelationInput[] =
      params.sort === 'mostDownloaded'
        ? [{ downloadCount: 'desc' }, { createdAt: 'desc' }]
        : params.sort === 'mostUpvoted'
          ? [{ upvoteCount: 'desc' }, { createdAt: 'desc' }]
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

const createSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional().default(''),
  subjectId: z.string().refine(isObjectId, 'invalid subjectId'),
  majorId: z.string().refine(isObjectId, 'invalid majorId'),
  category: z.nativeEnum(DocumentCategory),
  tags: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      return v
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }),
  teacherName: z.string().max(100).optional(),
  semester: z.string().max(20).optional(),
  academicYear: z.string().max(20).optional(),
});

router.post('/', requireAuth, upload.any(), async (req, res, next) => {
  const uploaded = (req.files as Express.Multer.File[] | undefined) ?? [];
  try {
    if (uploaded.length === 0) throw new HttpError(400, 'File is required');
    const data = createSchema.parse(req.body);

    const allImages = uploaded.every((f) => f.mimetype.startsWith('image/'));
    if (uploaded.length > 1 && !allImages) {
      throw new HttpError(400, 'Multiple files chỉ hỗ trợ khi tất cả là ảnh');
    }

    const primary = uploaded[0];
    const extras = uploaded.slice(1);
    const ext = path.extname(primary.originalname).slice(1).toLowerCase();
    const totalSize = uploaded.reduce((s, f) => s + f.size, 0);

    let previewPath: string | null = null;
    let previewMimeType: string | null = null;
    if (shouldConvertToPdf(ext)) {
      try {
        const result = await convertOfficeToPdf(primary.path);
        previewPath = result.outputPath;
        previewMimeType = result.mimeType;
      } catch (err) {
        console.warn('[convert] Failed to generate PDF preview:', err);
      }
    }

    const doc = await prisma.document.create({
      data: {
        title: data.title,
        description: data.description,
        subjectId: data.subjectId,
        majorId: data.majorId,
        category: data.category,
        tags: data.tags,
        teacherName: data.teacherName ?? null,
        semester: data.semester ?? null,
        academicYear: data.academicYear ?? null,
        uploaderId: req.user!.id,
        originalName: primary.originalname,
        storedName: primary.filename,
        path: primary.path,
        mimeType: primary.mimetype,
        size: totalSize,
        extension: ext,
        extraPaths: extras.map((f) => f.path),
        extraOriginalNames: extras.map((f) => f.originalname),
        previewPath,
        previewMimeType,
      },
    });

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { contributionPoints: { increment: 10 } },
    });

    res.status(201).json({ document: doc });
  } catch (err) {
    for (const f of uploaded) {
      if (fs.existsSync(f.path)) fs.unlink(f.path, () => undefined);
    }
    next(err);
  }
});

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) throw new HttpError(400, 'Invalid id');
    const existing = await prisma.document.findFirst({
      where: { id: req.params.id, status: 'public' },
      select: { id: true },
    });
    if (!existing) throw new HttpError(404, 'Document not found');
    const doc = await prisma.document.update({
      where: { id: req.params.id },
      data: { viewCount: { increment: 1 } },
      include: includeRefs,
    });
    res.json({ document: doc });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/download', optionalAuth, async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) throw new HttpError(400, 'Invalid id');
    const existing = await prisma.document.findFirst({
      where: { id: req.params.id, status: 'public' },
    });
    if (!existing) throw new HttpError(404, 'Document not found');
    await prisma.document.update({
      where: { id: existing.id },
      data: { downloadCount: { increment: 1 } },
    });

    const primary = path.resolve(existing.path);
    if (!fs.existsSync(primary)) throw new HttpError(410, 'File missing');

    if (existing.extraPaths.length === 0) {
      res.download(primary, existing.originalName);
      return;
    }

    const baseName = existing.originalName.replace(/\.[^.]+$/, '') || 'document';
    const zipName = `${baseName}.zip`;

    const zip = new AdmZip();
    const used = new Set<string>();
    function uniqueName(name: string) {
      let candidate = name;
      let i = 1;
      while (used.has(candidate)) {
        const ext = path.extname(name);
        const base = path.basename(name, ext);
        candidate = `${base}-${i}${ext}`;
        i += 1;
      }
      used.add(candidate);
      return candidate;
    }

    zip.addLocalFile(primary, '', uniqueName(existing.originalName));
    existing.extraPaths.forEach((p, idx) => {
      const abs = path.resolve(p);
      if (!fs.existsSync(abs)) return;
      const original = existing.extraOriginalNames[idx] ?? path.basename(p);
      zip.addLocalFile(abs, '', uniqueName(original));
    });

    const buffer = zip.toBuffer();
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(zipName)}"`);
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer);
  } catch (err) {
    next(err);
  }
});

function streamFile(res: any, absPath: string, mimeType: string, originalName: string) {
  if (!fs.existsSync(absPath)) throw new HttpError(410, 'File missing');
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(originalName)}"`);
  fs.createReadStream(absPath).pipe(res);
}

router.get('/:id/preview', async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) throw new HttpError(400, 'Invalid id');
    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, status: 'public' },
    });
    if (!doc) throw new HttpError(404, 'Document not found');
    if (doc.previewPath && doc.previewMimeType) {
      const previewName = doc.originalName.replace(/\.[^.]+$/, '') + '.pdf';
      streamFile(res, path.resolve(doc.previewPath), doc.previewMimeType, previewName);
      return;
    }
    streamFile(res, path.resolve(doc.path), doc.mimeType, doc.originalName);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/preview/:index', async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) throw new HttpError(400, 'Invalid id');
    const idx = Number.parseInt(req.params.index, 10);
    if (!Number.isFinite(idx) || idx < 0) throw new HttpError(400, 'Invalid index');
    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, status: 'public' },
    });
    if (!doc) throw new HttpError(404, 'Document not found');
    if (idx === 0) {
      streamFile(res, path.resolve(doc.path), doc.mimeType, doc.originalName);
      return;
    }
    const extraIdx = idx - 1;
    if (extraIdx >= doc.extraPaths.length) throw new HttpError(404, 'Page not found');
    const filePath = doc.extraPaths[extraIdx];
    const originalName = doc.extraOriginalNames[extraIdx] ?? `page-${idx}`;
    streamFile(res, path.resolve(filePath), mimeFromPath(filePath), originalName);
  } catch (err) {
    next(err);
  }
});

export default router;
