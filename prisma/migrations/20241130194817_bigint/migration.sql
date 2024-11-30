/*
  Warnings:

  - You are about to alter the column `report_count` on the `Spam` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Spam" ALTER COLUMN "report_count" SET DATA TYPE INTEGER;
