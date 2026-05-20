import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './modules/auth/auth.routes.js';
import documentRoutes from './modules/documents/document.routes.js';
import subjectRoutes from './modules/subjects/subject.routes.js';
import pointsRoutes from './modules/points/points.routes.js';
import giftRoutes from './modules/gifts/gift.routes.js';
import redemptionRoutes from './modules/gifts/redemption.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

export function createApp() {
  const app = express();
  // Để req.ip phản ánh đúng client sau proxy (ngrok / Vercel) — dùng cho khử trùng tải.
  app.set('trust proxy', 1);
  const allowedOrigins = env.clientOrigin;
  const vercelPreview = /^https:\/\/hust-docs-[a-z0-9-]+\.vercel\.app$/i;
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        if (vercelPreview.test(origin)) return callback(null, true);
        return callback(new Error(`CORS: origin ${origin} not allowed`));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/points', pointsRoutes);
  app.use('/api/gifts', giftRoutes);
  app.use('/api/redemptions', redemptionRoutes);
  app.use('/api', subjectRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
