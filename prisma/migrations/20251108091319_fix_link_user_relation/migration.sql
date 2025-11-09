/*
  Warnings:

  - You are about to drop the column `divices` on the `analytics_daily` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `links` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "analytics_daily" DROP COLUMN "divices",
ADD COLUMN     "devices" JSONB;

-- AlterTable
ALTER TABLE "links" DROP COLUMN "count",
ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "fullShortLink" DROP DEFAULT;
