import { Payment, TaxReport as PrismaTaxReport, File } from '@prisma/client';

export interface TaxReport extends PrismaTaxReport {
  file: Partial<File>;
  payments: Partial<Payment[]>;
}

export interface TaxReportCreateDto {
  fiscalQuarter: string;
  fiscalYear: string;
}

export interface TaxReportCreate {
  fiscalQuarter: number;
  fiscalYear: number;
}

export interface PaymentUpdateDto {
  isExempt?: boolean;
}

export interface TaxReportError {
  message: string;
}

export interface Report {
  month: string;
  taxableSales: string;
  nonTaxableSales: string;
  netTaxableSales: string;
}
