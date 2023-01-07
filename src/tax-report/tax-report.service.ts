import { Injectable } from '@nestjs/common';
import { Prisma, TaxReport } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TaxReportService {
  constructor(private readonly prisma: PrismaService) {}

  async createTaxReport(
    createTaxReportDto: Prisma.TaxReportCreateInput,
  ): Promise<TaxReport> {
    return this.prisma.taxReport.create({
      data: createTaxReportDto,
    });
  }
}
