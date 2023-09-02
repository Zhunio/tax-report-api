-- CreateTable
CREATE TABLE `TaxReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fiscalQuarter` INTEGER NOT NULL,
    `fiscalYear` INTEGER NOT NULL,
    `fileId` INTEGER NULL,

    UNIQUE INDEX `TaxReport_fileId_key`(`fileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileName` VARCHAR(191) NOT NULL,
    `fileDestination` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `isExempt` BOOLEAN NOT NULL,
    `taxReportId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TaxReport` ADD CONSTRAINT `TaxReport_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_taxReportId_fkey` FOREIGN KEY (`taxReportId`) REFERENCES `TaxReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
