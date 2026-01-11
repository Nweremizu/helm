/*
  Warnings:

  - You are about to drop the column `lastBalance` on the `linked_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `clean_merchant` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mono_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mono_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "budget_plans" ADD COLUMN     "color" TEXT,
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "daily_snapshots" ADD COLUMN     "breakdown" JSONB;

-- AlterTable
ALTER TABLE "linked_accounts" DROP COLUMN "lastBalance",
ADD COLUMN     "account_type" TEXT,
ADD COLUMN     "balance" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "institution_id" TEXT;

-- AlterTable
ALTER TABLE "saving_goals" ADD COLUMN     "color" TEXT,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "category",
DROP COLUMN "clean_merchant",
ADD COLUMN     "clean_category" TEXT,
ADD COLUMN     "clean_name" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'NGN',
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "is_processed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mono_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'NGN';

-- CreateTable
CREATE TABLE "merchant_rules" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "clean_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "match_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchant_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchant_rules_keyword_key" ON "merchant_rules"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_mono_id_key" ON "transactions"("mono_id");

-- CreateIndex
CREATE INDEX "transactions_is_processed_idx" ON "transactions"("is_processed");
