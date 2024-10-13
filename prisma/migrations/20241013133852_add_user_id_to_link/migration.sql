/*
  Warnings:

  - You are about to drop the `user_links` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_links" DROP CONSTRAINT "user_links_userId_fkey";

-- AlterTable
ALTER TABLE "links" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "user_links";

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
