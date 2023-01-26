import { Body, Controller, Post } from '@nestjs/common';
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
}
