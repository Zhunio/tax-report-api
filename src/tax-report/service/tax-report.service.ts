import { FileService } from '@/file/file.service';
import { PrismaService } from '@/prisma/prisma.service';
import { DuplicateTaxReportException } from '@/tax-report/exceptions/tax-report.exception';
import { TaxReportCreate } from '@/tax-report/types/tax-report.model';
import { Injectable } from '@nestjs/common';
import { TaxReport } from '@prisma/client';

@Injectable()
export class TaxReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async createTaxReport(taxReportCreate: TaxReportCreate, fileBuffer: Buffer) {
    const { fileName, fileDestination } = taxReportCreate;
    const fiscalQuarter = parseInt(taxReportCreate.fiscalQuarter);
    const fiscalYear = parseInt(taxReportCreate.fiscalYear);

    const isDuplicateTaxReport = await this.prisma.taxReport.findFirst({
      where: {
        fiscalQuarter,
        fiscalYear,
      },
    });

    if (isDuplicateTaxReport) {
      throw new DuplicateTaxReportException();
    }

    const { id } = await this.fileService.createFile(
      {
        fileName,
        fileDestination,
      },
      fileBuffer,
    );

    return this.prisma.taxReport.create({
      data: {
        fiscalQuarter,
        fiscalYear,
        fileId: id,
      },
      include: {
        file: true,
      },
    });
  }

  async deleteTaxReport(taxReportId: number): Promise<TaxReport> {
    return this.prisma.taxReport.delete({
      where: { id: taxReportId },
      include: {
        file: true,
      },
    });
  }
}
