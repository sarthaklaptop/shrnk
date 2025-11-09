/*
  Warnings:

  - You are about to drop the `analytics_daily` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."analytics_daily" DROP CONSTRAINT "analytics_daily_linkId_fkey";

-- DropTable
DROP TABLE "public"."analytics_daily";
