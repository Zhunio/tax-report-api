-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "isExempt" BOOLEAN NOT NULL,
    "taxReportId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_taxReportId_fkey" FOREIGN KEY ("taxReportId") REFERENCES "TaxReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
