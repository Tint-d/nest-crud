/*
  Warnings:

  - You are about to drop the column `googleId` on the `POST` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "POST_googleId_key";

-- AlterTable
ALTER TABLE "POST" DROP COLUMN "googleId";
