import { AppModule } from '@/app/app.module';
import { FileRequest } from '@/file/file-request';
import { PrismaService } from '@/prisma/prisma.service';
import {
  TaxReportReq,
  fileShape,
  paymentShape,
  taxReportShape,
} from '@/tax-report/tax-report-test.utils';
import { TaxReportExceptionMessage } from '@/tax-report/tax-report.exception';
import { TaxReport, TaxReportError } from '@/tax-report/tax-report.model';
import { getTaxReportFileDto } from '@/tax-report/tax-report.utils';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('TaxController (e2e)', () => {
  let req: TaxReportReq;
  let fileReq: FileRequest;
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get(PrismaService);
    req = new TaxReportReq(app);
    fileReq = new FileRequest(app);

    await app.init();
    await prismaService.cleanDatabase();
  });

  describe('getAllTaxReports()', () => {
    it('should get all tax reports', async () => {
      await req.createTaxReport({ fiscalQuarter: '1', fiscalYear: '1999' });
      const taxReports = await req.getAllTaxReports<TaxReport[]>();

      for (const { file, payments, ...taxReport } of taxReports) {
        expect(file).toEqual(fileShape());
        expect(payments).toEqual(expect.arrayContaining([paymentShape()]));
        expect(taxReport).toEqual(taxReportShape());
      }
    });
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

  describe('editTaxReportPayment()', () => {
    it('should edit payment', async () => {
      const { id, payments } = await req.createTaxReport({
        fiscalQuarter: '1',
        fiscalYear: '1997',
      });

      for (const payment of payments) {
        await req.editTaxReportPayment(id, payment.id, { isExempt: true });
      }

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
      const taxReportFileDeleted = await fileReq.getFileById(taxReport.fileId);

      const taxReportFound = await req.getTaxReportById(taxReport.id);

      expect(taxReport).toEqual(taxReportShape(taxReportDeleted));
      expect(taxReportFileDeleted).toEqual({});
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
