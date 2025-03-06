-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_planId_fkey";

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "planId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_planId_fkey" FOREIGN KEY ("planId") REFERENCES "account_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
