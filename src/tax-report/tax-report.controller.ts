import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Prisma, TaxReport } from '@prisma/client';
import { TaxReportService } from './tax-report.service';

@Controller('tax-report')
export class TaxReportController {
  constructor(private readonly taxReportService: TaxReportService) {}

  @Post()
  async createTaxReport(
    @Body() createTaxReportDto: Prisma.TaxReportCreateInput,
  ): Promise<TaxReport> {
    return this.taxReportService.createTaxReport(createTaxReportDto);
  }

  @Delete(':taxReportId')
  async deleteTaxReport(
    @Param('taxReportId') taxReportId: string,
  ): Promise<TaxReport> {
    return this.taxReportService.deleteTaxReport(parseInt(taxReportId, 10));
  }
}
