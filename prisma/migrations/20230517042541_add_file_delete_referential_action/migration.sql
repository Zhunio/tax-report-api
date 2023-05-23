-- DropForeignKey
ALTER TABLE "TaxReport" DROP CONSTRAINT "TaxReport_fileId_fkey";

-- AddForeignKey
ALTER TABLE "TaxReport" ADD CONSTRAINT "TaxReport_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
