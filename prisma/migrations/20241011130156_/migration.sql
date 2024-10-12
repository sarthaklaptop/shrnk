/*
  Warnings:

  - A unique constraint covering the columns `[fullShortLink]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "clickLimit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fullShortLink" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Link_fullShortLink_key" ON "Link"("fullShortLink");
