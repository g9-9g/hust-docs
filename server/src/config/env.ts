import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/hust_docs',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB ?? 50),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  libreOfficePath: process.env.LIBREOFFICE_PATH ?? 'soffice',
  libreOfficeTimeoutMs: Number(process.env.LIBREOFFICE_TIMEOUT_MS ?? 120000),
};
