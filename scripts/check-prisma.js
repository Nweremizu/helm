#!/usr/bin/env node
const { PrismaClient } = require('../app/generated/prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    console.log('Attempting to connect to DB...');
    const now = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log('Query result:', now);
    const users = await prisma.user.findMany({ take: 1 });
    console.log('User sample:', users);
    await prisma.$disconnect();
    console.log('Disconnected cleanly');
    process.exit(0);
  } catch (err) {
    console.error('Prisma connectivity error:', err);
    try { await prisma.$disconnect(); } catch(e) {}
    process.exit(1);
  }
})();