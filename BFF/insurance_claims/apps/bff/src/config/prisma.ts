import { PrismaClient } from "@prisma/client";

//  This is the standard singleton pattern used in Node.js applications to avoid creating multiple Prisma connections during development.

declare global {
  // Prevent multiple Prisma instances during development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;