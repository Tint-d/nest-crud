/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `POST` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "POST" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "POST_googleId_key" ON "POST"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
