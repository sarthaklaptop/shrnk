/*
  Warnings:

  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Link";

-- CreateTable
CREATE TABLE "links" (
    "id" SERIAL NOT NULL,
    "longLink" TEXT NOT NULL,
    "shortLink" TEXT NOT NULL,
    "fullShortLink" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 0,
    "clickLimit" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_longLink_key" ON "links"("longLink");

-- CreateIndex
CREATE UNIQUE INDEX "links_shortLink_key" ON "links"("shortLink");

-- CreateIndex
CREATE UNIQUE INDEX "links_fullShortLink_key" ON "links"("fullShortLink");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
