/*
  Warnings:

  - You are about to drop the column `address` on the `vendors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessName]` on the table `vendors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessName` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `vendors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "address",
ADD COLUMN     "businessName" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "vendors_businessName_key" ON "vendors"("businessName");
