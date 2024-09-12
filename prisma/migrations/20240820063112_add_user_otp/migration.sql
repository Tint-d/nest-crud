/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `POST` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `POST` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorSecret` on the `POST` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "POST" DROP COLUMN "refreshToken",
DROP COLUMN "twoFactorEnabled",
DROP COLUMN "twoFactorSecret";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;
