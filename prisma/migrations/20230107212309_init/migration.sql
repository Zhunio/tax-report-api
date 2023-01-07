-- CreateTable
CREATE TABLE "TaxReport" (
    "id" SERIAL NOT NULL,
    "fiscalQuarter" INTEGER NOT NULL,
    "fiscalYear" INTEGER NOT NULL,

    CONSTRAINT "TaxReport_pkey" PRIMARY KEY ("id")
);
