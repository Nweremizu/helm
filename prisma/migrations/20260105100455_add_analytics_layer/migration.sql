/*
  Warnings:

  - You are about to drop the column `totalBalance` on the `daily_snapshots` table. All the data in the column will be lost.
  - You are about to alter the column `balance` on the `linked_accounts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - Added the required column `total_balance` to the `daily_snapshots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daily_snapshots" DROP COLUMN "totalBalance",
ADD COLUMN     "total_balance" INTEGER NOT NULL,
ADD COLUMN     "total_expense" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_income" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "linked_accounts" ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "expected_salary_day" INTEGER,
ADD COLUMN     "salary_keyword" TEXT;
