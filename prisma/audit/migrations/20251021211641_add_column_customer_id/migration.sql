/*
  Warnings:

  - You are about to drop the column `entity_id` on the `audit_logs` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `audit_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `audit_logs` DROP COLUMN `entity_id`,
    ADD COLUMN `customerId` VARCHAR(191) NOT NULL;
