/*
  Warnings:

  - Changed the type of `type` on the `RefreshToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('user', 'vendor');

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "type",
ADD COLUMN     "type" "AccountType" NOT NULL;
