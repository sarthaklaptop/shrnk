/*
  Warnings:

  - Made the column `userId` on table `links` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "links" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "userId" SET DEFAULT 'null';
