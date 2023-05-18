import { AppModule } from '@/app/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import {
  TaxReportReq,
  fileShape,
  mapIsExemptToTrue,
  paymentShape,
  taxReportShape,
} from '@/tax-report/tax-report-test.utils';
import { TaxReportExceptionMessage } from '@/tax-report/tax-report.exception';
import { TaxReportError } from '@/tax-report/tax-report.model';
import { getTaxReportFileDto } from '@/tax-report/tax-report.utils';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('TaxController (e2e)', () => {
  let req: TaxReportReq;
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get(PrismaService);
    req = new TaxReportReq(app);

    await app.init();
    await prismaService.cleanDatabase();
  });

  describe('getTaxReportById()', () => {
    it('should get tax report by id', async () => {
      const { id } = await req.createTaxReport({ fiscalQuarter: '1', fiscalYear: '1995' });
      const { file, payments, ...taxReport } = await req.getTaxReportById(id);

      expect(file).toEqual(fileShape());
      expect(payments).toEqual(expect.arrayContaining([paymentShape()]));
      expect(taxReport).toEqual(taxReportShape({ fiscalQuarter: 1, fiscalYear: 1995 }));
    });
  });

  describe('createTaxReport()', () => {
    it('should create tax report', async () => {
      const { id } = await req.createTaxReport({ fiscalQuarter: '1', fiscalYear: '1996' });
      const { file, payments, ...taxReport } = await req.getTaxReportById(id);

      expect(payments).toEqual(expect.arrayContaining([paymentShape()]));
      expect(taxReport).toEqual(taxReportShape({ fiscalQuarter: 1, fiscalYear: 1996 }));
      expect(file).toEqual(fileShape(getTaxReportFileDto({ fiscalQuarter: 1, fiscalYear: 1996 })));
    });

    it('should throw an error when trying to create duplicate tax report', async () => {
      await req.createTaxReport({ fiscalQuarter: '2', fiscalYear: '1996' });
      const { message } = await req.createTaxReport<TaxReportError>({
        fiscalQuarter: '2',
        fiscalYear: '1996',
      });

      expect(message).toEqual(TaxReportExceptionMessage.DuplicateTaxReport);
    });
  });

  describe('bulkEditTaxReport()', () => {
    it('should edit payment', async () => {
      const { id, payments } = await req.createTaxReport({
        fiscalQuarter: '1',
        fiscalYear: '1997',
      });
      await req.bulkEditTaxReport(id, payments.map(mapIsExemptToTrue));
      const { file, payments: paymentsUpdated, ...taxReport } = await req.getTaxReportById(id);

      expect(taxReport).toEqual(taxReportShape());
      expect(file).toEqual(fileShape());
      expect(paymentsUpdated).toEqual(expect.arrayContaining([paymentShape({ isExempt: true })]));
    });
  });

  describe('deleteTaxReport()', () => {
    it('should delete tax report', async () => {
      const taxReport = await req.createTaxReport({ fiscalQuarter: '1', fiscalYear: '1998' });
      const taxReportDeleted = await req.deleteTaxReport(taxReport.id);
      const taxReportFound = await req.getTaxReportById(taxReport.id);

      expect(taxReport).toEqual(taxReportShape(taxReportDeleted));
      expect(taxReportFound).toEqual({});
    });

    it('should throw an error when trying to delete report that does not exist', async () => {
      app.useLogger(false);

      const taxReportId = -1;
      const { message } = await req.deleteTaxReport<TaxReportError>(taxReportId);
      expect(message).toEqual(TaxReportExceptionMessage.CouldNotDeleteTaxReportException);
    });
  });

  afterAll(async () => {
    await app.close();
    await prismaService.cleanDatabase();
  });
});
