/*
  Warnings:

  - A unique constraint covering the columns `[fileId]` on the table `TaxReport` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TaxReport" ADD COLUMN     "fileId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "TaxReport_fileId_key" ON "TaxReport"("fileId");

-- AddForeignKey
ALTER TABLE "TaxReport" ADD CONSTRAINT "TaxReport_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
