import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,              
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}


async function shutdownPrisma() {
  console.log('Disconnecting Prisma...');
  await prisma.$disconnect();
}

process.on('SIGINT', async () => {
  await shutdownPrisma();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdownPrisma();
  process.exit(0);
});

process.on('beforeExit', async () => {
  await shutdownPrisma();
});
