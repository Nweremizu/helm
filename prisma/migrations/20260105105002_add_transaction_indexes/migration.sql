-- CreateIndex
CREATE INDEX "transactions_user_id_date_type_idx" ON "transactions"("user_id", "date", "type");

-- CreateIndex
CREATE INDEX "transactions_user_id_clean_category_idx" ON "transactions"("user_id", "clean_category");
