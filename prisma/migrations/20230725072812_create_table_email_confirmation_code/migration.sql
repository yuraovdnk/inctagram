/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "email_confirmation_codes" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_confirmation_codes_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_confirmation_codes_userId_key" ON "email_confirmation_codes"("userId");

-- AddForeignKey
ALTER TABLE "email_confirmation_codes" ADD CONSTRAINT "email_confirmation_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
