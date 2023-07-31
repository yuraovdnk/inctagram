/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `auth_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_deviceId_key" ON "auth_sessions"("deviceId");
