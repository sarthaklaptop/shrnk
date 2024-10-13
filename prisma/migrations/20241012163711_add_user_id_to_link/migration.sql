/*
  Warnings:

  - The primary key for the `links` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `links` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_userId_fkey";

-- AlterTable
ALTER TABLE "links" DROP CONSTRAINT "links_pkey",
DROP COLUMN "userId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "links_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "links_id_seq";

-- CreateTable
CREATE TABLE "user_links" (
    "id" TEXT NOT NULL,
    "longLink" TEXT NOT NULL,
    "shortLink" TEXT NOT NULL,
    "fullShortLink" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 0,
    "clickLimit" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_links_longLink_key" ON "user_links"("longLink");

-- CreateIndex
CREATE UNIQUE INDEX "user_links_shortLink_key" ON "user_links"("shortLink");

-- CreateIndex
CREATE UNIQUE INDEX "user_links_fullShortLink_key" ON "user_links"("fullShortLink");

-- AddForeignKey
ALTER TABLE "user_links" ADD CONSTRAINT "user_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
