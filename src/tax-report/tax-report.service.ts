import { ExcelService } from '@/excel/excel.service';
import { FileService } from '@/file/file.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CouldNotDeleteTaxReportException,
  DuplicateTaxReportException,
} from '@/tax-report/tax-report.exception';
import {
  PaymentUpdateDto,
  TaxReport,
  TaxReportCreate,
} from '@/tax-report/tax-report.model';
import { getTaxReportFileDto } from '@/tax-report/tax-report.utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaxReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly excelService: ExcelService,
  ) {}

  async getAllTaxReports(): Promise<TaxReport[]> {
    const taxReports = await this.prisma.taxReport.findMany({
      include: { file: true, payments: true },
    });

    return taxReports;
  }

  async getTaxReportById(taxReportId: number) {
    const taxReport = await this.prisma.taxReport.findFirst({
      where: { id: taxReportId },
      include: { file: true, payments: true },
    });

    return taxReport;
  }

  async createTaxReport(
    taxReportCreateDto: TaxReportCreate,
    fileBuffer: Buffer,
  ): Promise<TaxReport> {
    const isDuplicateTaxReport = await this.prisma.taxReport.findFirst({
      where: taxReportCreateDto,
    });
    if (isDuplicateTaxReport) {
      throw new DuplicateTaxReportException();
    }

    const fileDto = getTaxReportFileDto(taxReportCreateDto);
    const { id: fileId } = await this.fileService.createFile(
      fileDto,
      fileBuffer,
    );

    const payments = await this.excelService.parsePayments(fileBuffer);
    const taxReport = this.prisma.taxReport.create({
      data: { ...taxReportCreateDto, fileId, payments: { create: payments } },
      include: { file: true, payments: true },
    });

    return taxReport;
  }

  async bulkEditTaxReportPayments(
    taxReportId: number,
    paymentUpdates: PaymentUpdateDto[],
  ): Promise<TaxReport> {
    for (const { id, ...data } of paymentUpdates) {
      await this.prisma.payment.update({ where: { id }, data });
    }

    const taxReport = await this.prisma.taxReport.findFirst({
      where: { id: taxReportId },
      include: { file: true, payments: true },
    });

    return taxReport;
  }

  async deleteTaxReport(taxReportId: number): Promise<TaxReport> {
    try {
      const taxReport = await this.prisma.taxReport.delete({
        where: { id: taxReportId },
        include: { file: true, payments: true },
      });

      return taxReport;
    } catch (error) {
      throw new CouldNotDeleteTaxReportException();
    }
  }
}
