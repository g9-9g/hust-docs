import { prisma } from './prisma.js';
import { env } from './env.js';

export async function connectDb() {
  await prisma.$connect();
  console.log(`[db] connected: ${env.mongoUri}`);
}

export async function disconnectDb() {
  await prisma.$disconnect();
}
