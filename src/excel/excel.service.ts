import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import currency from 'currency.js';
import { format } from 'date-fns';
import { read, utils } from 'xlsx';
import { ExcelPayment } from './excel.model';

@Injectable()
export class ExcelService {
  async parsePayments(fileBuffer: Buffer) {
    const workbook = read(fileBuffer, { cellDates: true });
    const payments: Prisma.PaymentCreateWithoutTaxReportInput[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = utils.sheet_to_json<ExcelPayment>(sheet);
      for (const payment of rows) {
        if ('__EMPTY' in payment) {
        } else {
          payments.push({
            type: payment.Type,
            date: format(payment.Date, 'MM/dd/yyyy'),
            number: payment.Num,
            name: payment.Name,
            method: payment['Pay Meth'],
            amount: currency(payment.Amount).toString(),
            isExempt: false,
          });
        }
      }
    }

    return payments;
  }
}
