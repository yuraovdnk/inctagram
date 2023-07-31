/*
  Warnings:

  - Added the required column `deviceId` to the `auth_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auth_sessions" ADD COLUMN     "deviceId" TEXT NOT NULL;
