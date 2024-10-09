-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '24 hours');
