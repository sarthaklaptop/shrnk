-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "longLink" TEXT NOT NULL,
    "shortLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_longLink_key" ON "Link"("longLink");

-- CreateIndex
CREATE UNIQUE INDEX "Link_shortLink_key" ON "Link"("shortLink");
