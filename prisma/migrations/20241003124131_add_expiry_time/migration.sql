-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT (now() + interval '24 hours');
