/*
  Warnings:

  - You are about to drop the column `deleteAt` on the `Charge` table. All the data in the column will be lost.
  - You are about to drop the column `deleteAt` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Charge" DROP COLUMN "deleteAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "deleteAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
