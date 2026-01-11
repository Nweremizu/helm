import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// import { withAccelerate } from "@prisma/extension-accelerate";

const connectionString = process.env.DATABASE_URL || "";

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({ adapter });
