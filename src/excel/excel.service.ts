import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as currency from 'currency.js';
import { format, isDate } from 'date-fns';
import { Row, Workbook, Worksheet } from 'exceljs';

@Injectable()
export class ExcelService {
  async parsePayments(fileBuffer: Buffer) {
    const workbook = await new Workbook().xlsx.load(fileBuffer);
    const payments: Prisma.PaymentCreateWithoutTaxReportInput[] = [];

    workbook.eachSheet?.((worksheet) => this.parseSheet(worksheet, payments));

    return payments;
  }

  private parseSheet(
    worksheet: Worksheet,
    payments: Prisma.PaymentCreateWithoutTaxReportInput[],
  ): void {
    this.setColumnNames(worksheet);
    worksheet.eachRow((row) => this.parseRow(row, payments));
  }

  private setColumnNames(worksheet: Worksheet) {
    worksheet.columns = [
      { header: '', key: 'A' },
      { header: 'Type', key: 'paymentType' },
      { header: '', key: 'C' },
      { header: 'Date', key: 'paymentDate' },
      { header: '', key: 'E' },
      { header: 'Num', key: 'paymentNumber' },
      { header: '', key: 'G' },
      { header: 'Name', key: 'customerName' },
      { header: '', key: 'I' },
      { header: 'Pay Meth', key: 'paymentMethod' },
      { header: '', key: 'K' },
      { header: 'Amount', key: 'total' },
    ];
  }

  private parseRow(
    row: Row,
    payments: Prisma.PaymentCreateWithoutTaxReportInput[],
  ) {
    const type = row.getCell('paymentType').value as string;
    const date = row.getCell('paymentDate').value as Date;
    const number = row.getCell('paymentNumber').value as string;
    const name = row.getCell('customerName').value as string;
    const method = row.getCell('paymentMethod').value as string;
    const total = row.getCell('total').value as number;

    if (isDate(date)) {
      const payment: Prisma.PaymentCreateWithoutTaxReportInput = {
        type,
        date: format(new Date(date), 'MM/dd/yyyy'),
        number,
        name,
        method,
        total: currency(total).toString(),
        isExempt: false,
      };

      payments.push(payment);
    }
  }
}
