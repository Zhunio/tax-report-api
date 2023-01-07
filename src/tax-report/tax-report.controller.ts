import { Body, Controller, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaxReportService } from './tax-report.service';

@Controller('tax-report')
export class TaxReportController {
  constructor(private readonly taxReportService: TaxReportService) {}

  @Post()
  async createTaxReport(
    @Body() createTaxReportDto: Prisma.TaxReportCreateInput,
  ) {
    return this.taxReportService.createTaxReport(createTaxReportDto);
  }
}
