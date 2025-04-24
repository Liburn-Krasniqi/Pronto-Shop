/*
  Warnings:

  - A unique constraint covering the columns `[vendorId]` on the table `VendorAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VendorAddress_vendorId_key" ON "VendorAddress"("vendorId");
