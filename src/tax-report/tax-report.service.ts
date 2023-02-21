import { Injectable } from '@nestjs/common';
import { Prisma, TaxReport } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DuplicateTaxReportException } from './tax-report.exception';

@Injectable()
export class TaxReportService {
  constructor(private readonly prisma: PrismaService) {}

  async createTaxReport(
    taxReportDto: Prisma.TaxReportCreateInput,
  ): Promise<TaxReport> {
    const isDuplicateTaxReport = await this.prisma.taxReport.findFirst({
      where: {
        fiscalQuarter: taxReportDto.fiscalQuarter,
        fiscalYear: taxReportDto.fiscalYear,
      },
    });

    if (isDuplicateTaxReport) {
      throw new DuplicateTaxReportException();
    }

    return this.prisma.taxReport.create({
      data: taxReportDto,
    });
  }

  async deleteTaxReport(taxReportId: number): Promise<TaxReport> {
    return this.prisma.taxReport.delete({
      where: { id: taxReportId },
    });
  }
}
