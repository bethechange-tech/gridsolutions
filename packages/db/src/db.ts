
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const adapter = new PrismaPg(
    { connectionString: process.env.DATABASE_URL },
    { schema: "tenuq" }
  );
  return new PrismaClient({ adapter });
}

const prismaGlobal = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const db = prismaGlobal.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = db;
}

export { db };
