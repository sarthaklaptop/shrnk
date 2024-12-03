-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('FREE', 'PREMIUM');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "creditRenewed" TIMESTAMP(3),
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'FREE';
