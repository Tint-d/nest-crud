/*
  Warnings:

  - You are about to drop the column `password_confirmation` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `POST` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_confirmation";

-- CreateIndex
CREATE UNIQUE INDEX "POST_id_key" ON "POST"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
