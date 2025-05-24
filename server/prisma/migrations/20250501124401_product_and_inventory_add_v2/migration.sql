/*
  Warnings:

  - You are about to drop the column `Vendorid` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `descpription` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(255)`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `discountPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorid` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_Vendorid_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- DropIndex
DROP INDEX "Inventory_Vendorid_key";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "Vendorid",
ALTER COLUMN "stockQuantity" SET DEFAULT 0,
ALTER COLUMN "restockDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "descpription",
ADD COLUMN     "description" VARCHAR(511) NOT NULL,
ADD COLUMN     "vendorid" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "discountPrice" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "Product_id_idx" ON "Product"("id");

-- CreateIndex
CREATE INDEX "vendors_id_idx" ON "vendors"("id");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorid_fkey" FOREIGN KEY ("vendorid") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
