-- CreateTable
CREATE TABLE `audit_logs` (
    `log_id` INTEGER NOT NULL AUTO_INCREMENT,
    `entity_id` VARCHAR(191) NOT NULL,
    `entity_type` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `details` JSON NULL,

    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
