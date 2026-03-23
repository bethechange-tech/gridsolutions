
export { Prisma, PrismaClient } from "@prisma/client";
export type {
  Product as ProductEntity,
  Order as OrderEntity,
  Transaction as TransactionEntity,
  ConsultancyStage as ConsultancyStageEntity,
  ContactSubmission as ContactSubmissionEntity,
  BlogPost as BlogPostEntity,
} from "@prisma/client";
export { db } from "./db";
export { genId } from "./util";
