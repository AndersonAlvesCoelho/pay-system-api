-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "deleteAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "deleteAt" TIMESTAMP(3);
