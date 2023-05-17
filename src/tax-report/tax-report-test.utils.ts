import {
  PaymentUpdateDto,
  TaxReport,
  TaxReportCreateDto,
  TaxReportError,
} from '@/tax-report/tax-report.model';
import { INestApplication } from '@nestjs/common';
import { File, Payment } from '@prisma/client';
import * as request from 'supertest';

export class TaxReportReq {
  private req: request.SuperTest<request.Test>;

  constructor(app: INestApplication) {
    this.req = request(app.getHttpServer());
  }

  async getTaxReportById<T extends TaxReport | TaxReportError = TaxReport>(
    taxReportId: number,
  ) {
    const { body } = await this.req.get('/tax-report/' + taxReportId);
    return body as T;
  }

  async createTaxReport<T extends TaxReport | TaxReportError = TaxReport>({
    fiscalQuarter,
    fiscalYear,
  }: TaxReportCreateDto) {
    const filepath = './src/excel/tax-report.xlsx';
    const { body } = await this.req
      .post('/tax-report')
      .field('fiscalQuarter', fiscalQuarter)
      .field('fiscalYear', fiscalYear)
      .attach('file', filepath);
    return body as T;
  }

  async bulkEditTaxReport<T extends TaxReport | TaxReportError = TaxReport>(
    taxReportId: number,
    paymentUpdates: PaymentUpdateDto[],
  ) {
    const { body } = await this.req
      .patch(`/tax-report/${taxReportId}/bulk/payment`)
      .send(paymentUpdates);
    return body as T;
  }

  async deleteTaxReport<T extends TaxReport | TaxReportError = TaxReport>(
    taxReportId: number,
  ) {
    const { body } = await this.req.delete('/tax-report/' + taxReportId);
    return body as T;
  }
}

export function fileShape(file?: Partial<File>) {
  return expect.objectContaining({
    id: file?.id ?? expect.any(Number),
    fileName: file?.fileName ?? expect.any(String),
    fileDestination: file?.fileDestination ?? expect.any(String),
  });
}

export function paymentShape(payment?: Partial<Payment>) {
  return expect.objectContaining({
    id: payment?.id ?? expect.any(Number),
    type: payment?.type ?? expect.any(String),
    date: payment?.date ?? expect.any(String),
    number: payment?.number ?? expect.any(String),
    name: payment?.name ?? expect.any(String),
    method: payment?.method ?? expect.any(String),
    amount: payment?.amount ?? expect.any(String),
    isExempt: payment?.isExempt ?? expect.any(Boolean),
  });
}

export function taxReportShape(taxReport?: Partial<TaxReport>) {
  return expect.objectContaining({
    id: taxReport?.id ?? expect.any(Number),
    fiscalQuarter: taxReport?.fiscalQuarter ?? expect.any(Number),
    fiscalYear: taxReport?.fiscalYear ?? expect.any(Number),
    fileId: taxReport?.fileId ?? expect.any(Number),
  });
}

export function mapIsExemptToTrue(payment: Payment) {
  return { ...payment, isExempt: true };
}