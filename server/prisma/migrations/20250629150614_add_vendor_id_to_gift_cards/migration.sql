-- AlterTable
ALTER TABLE "gift_cards" ADD COLUMN     "vendorId" INTEGER;

-- CreateIndex
CREATE INDEX "gift_cards_vendorId_idx" ON "gift_cards"("vendorId");

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
