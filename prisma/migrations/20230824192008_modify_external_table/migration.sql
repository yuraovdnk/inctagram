/*
  Warnings:

  - The primary key for the `external_acccounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `displayName` on the `external_acccounts` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `external_acccounts` table. All the data in the column will be lost.
  - You are about to drop the `external_account_confirmations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "external_account_confirmations" DROP CONSTRAINT "external_account_confirmations_providerId_fkey";

-- DropIndex
DROP INDEX "external_acccounts_providerId_key";

-- AlterTable
ALTER TABLE "external_acccounts" DROP CONSTRAINT "external_acccounts_pkey",
DROP COLUMN "displayName",
DROP COLUMN "id",
ADD CONSTRAINT "external_acccounts_pkey" PRIMARY KEY ("providerId");

-- DropTable
DROP TABLE "external_account_confirmations";
