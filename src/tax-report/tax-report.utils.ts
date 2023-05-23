import { TaxReportCreate } from '@/tax-report/tax-report.model';

export function getTaxReportFileDto({
  fiscalYear,
  fiscalQuarter,
}: TaxReportCreate) {
  const fileName = 'tax-report.txt';
  const fileDestination = `/test/tax-report/${fiscalYear}/Q${fiscalQuarter}`;

  return { fileName, fileDestination };
}
