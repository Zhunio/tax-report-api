import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import currency from 'currency.js';
import { readFile } from 'fs/promises';
import handlebars from 'handlebars';
import { resolve } from 'path';
import { EmailService } from '../email/email.service';
import { ExcelService } from '../excel/excel.service';
import { FileService } from '../file/file.service';
import { PrismaService } from '../prisma/prisma.service';
import { calculateReport, sumTotal } from './calculate-report';
import { calculatePriceTaxAndTotal } from './payment-mapper';
import {
  CouldNotDeleteTaxReportException,
  CouldNotEmailTaxReportException,
  DuplicateTaxReportException,
} from './tax-report.exception';
import {
  PaymentUpdateDto,
  TaxReport,
  TaxReportCreate,
} from './tax-report.model';
import { getTaxReportFileDto } from './tax-report.utils';

@Injectable()
export class TaxReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly excelService: ExcelService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
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

  async editTaxReportPayment(
    taxReportId: number,
    paymentId: number,
    paymentUpdate: PaymentUpdateDto,
  ): Promise<TaxReport> {
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: paymentUpdate,
    });

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

      const file = await this.fileService.getFileById(taxReport.fileId);
      if (file) {
        await this.fileService.deleteFile(taxReport.fileId);
      }

      return taxReport;
    } catch (error) {
      throw new CouldNotDeleteTaxReportException();
    }
  }

  async sendEmail(taxReportId: number) {
    try {
      const taxReport = await this.getTaxReportById(taxReportId);
      const to = this.getEmailTo();
      const subject = this.getEmailSubject(taxReport);
      const html = await this.getEmailTemplate(taxReport);

      return await this.emailService.sendEmail({ to, subject, html });
    } catch (error) {
      throw new CouldNotEmailTaxReportException();
    }
  }

  private getEmailTo() {
    const defaultEmailRecipients = [
      {
        name: 'Richard Zhunio',
        address: '967968+Zhunio@users.noreply.github.com',
      },
    ];
    const emailRecipients = JSON.parse(
      this.configService.get('EMAIL_RECIPIENTS'),
    );

    const to = emailRecipients ?? defaultEmailRecipients;

    return to;
  }

  private getEmailSubject({ fiscalQuarter, fiscalYear }: TaxReport) {
    const fiscalQuarterToMonthNamesMap = {
      1: 'December, January, February',
      2: 'March, April, May',
      3: 'June, July, August',
      4: 'September, October, November',
    };

    const fiscalQuarterMonthNames = fiscalQuarterToMonthNamesMap[fiscalQuarter];
    const subject = `Quarter Report ${fiscalQuarter} for ${fiscalQuarterMonthNames} ${fiscalYear}`;

    return subject;
  }

  private async getEmailTemplate(taxReport: TaxReport) {
    const payments = taxReport.payments.map(calculatePriceTaxAndTotal);
    const reports = calculateReport(payments);
    const formattedReports = reports.map((report) => ({
      ...report,
      taxableSales: currency(report.taxableSales).format(),
      nonTaxableSales: currency(report.nonTaxableSales).format(),
      netTaxableSales: currency(report.netTaxableSales).format(),
    }));

    const totalTaxableSales = currency(
      sumTotal(reports, 'taxableSales'),
    ).format();
    const totalNonTaxableSales = currency(
      sumTotal(reports, 'nonTaxableSales'),
    ).format();
    const totalNetTaxableSales = currency(
      sumTotal(reports, 'netTaxableSales'),
    ).format();
    const computedTotalNetTaxableSales = currency(
      sumTotal(reports, 'netTaxableSales'),
    )
      .multiply(0.08125)
      .format();

    const handlebarsContext = {
      taxReport,
      formattedReports,
      totalTaxableSales,
      totalNonTaxableSales,
      totalNetTaxableSales,
      computedTotalNetTaxableSales,
    };
    const template = await readFile(
      resolve(__dirname, './tax-report.handlebars'),
      { encoding: 'utf-8' },
    );
    const compileTemplate = handlebars.compile(template);
    const html = compileTemplate(handlebarsContext);

    return html;
  }
}
