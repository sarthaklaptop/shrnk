/*
  Warnings:

  - You are about to drop the column `clickHistory` on the `links` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clicks" ADD COLUMN     "browser" TEXT,
ADD COLUMN     "os" TEXT;

-- AlterTable
ALTER TABLE "links" DROP COLUMN "clickHistory";

-- CreateTable
CREATE TABLE "analytics_daily" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "countries" JSONB,
    "browsers" JSONB,
    "divices" JSONB,

    CONSTRAINT "analytics_daily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "analytics_daily_linkId_date_key" ON "analytics_daily"("linkId", "date");

-- CreateIndex
CREATE INDEX "clicks_linkId_idx" ON "clicks"("linkId");

-- CreateIndex
CREATE INDEX "clicks_createdAt_idx" ON "clicks"("createdAt");

-- AddForeignKey
ALTER TABLE "analytics_daily" ADD CONSTRAINT "analytics_daily_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
