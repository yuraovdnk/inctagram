/*
  Warnings:

  - Added the required column `deviceName` to the `auth_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auth_sessions" ADD COLUMN     "deviceName" TEXT NOT NULL;
