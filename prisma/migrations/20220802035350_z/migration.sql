/*
  Warnings:

  - Added the required column `title` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "title" TEXT NOT NULL;
