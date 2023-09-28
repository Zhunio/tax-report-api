import { TaxReportCreate } from '@/tax-report/tax-report.model';

export function getTaxReportFileDto({
  fiscalYear,
  fiscalQuarter,
}: TaxReportCreate) {
  const fileName = 'tax-report.xlsx';
  const fileDestination = `/tax-report/${fiscalYear}/Q${fiscalQuarter}`;

  return { fileName, fileDestination };
}
