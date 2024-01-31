import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SentMessageInfo } from 'nodemailer';
import { AuthGuardMock } from '../auth/auth-test.utils';
import { AuthGuard } from '../auth/auth.guard';
import { EmailService } from '../email/email.service';
import { FileRequest } from '../file/file-request';
import { PrismaService } from '../prisma/prisma.service';
import { TaxReportReq, fileShape, paymentShape, taxReportShape } from './tax-report-test.utils';
import { TaxReportExceptionMessage } from './tax-report.exception';
import { TaxReport, TaxReportError } from './tax-report.model';
import { TaxReportModule } from './tax-report.module';
import { getTaxReportFileDto } from './tax-report.utils';

const { spyOn } = jest;

describe('TaxController', () => {
  let app: INestApplication;
  let taxReportReq: TaxReportReq;
  let fileReq: FileRequest;
  let prismaService: PrismaService;
  let emailService: EmailService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TaxReportModule],
    })
      .overrideGuard(AuthGuard)
      .useClass(AuthGuardMock)
      .compile();

    app = module.createNestApplication();
    prismaService = module.get(PrismaService);
    emailService = module.get(EmailService);
    taxReportReq = new TaxReportReq(app);
    fileReq = new FileRequest(app);

    await app.init();
    await prismaService.cleanDatabase();
  });

  describe('getAllTaxReports()', () => {
    it('should get all tax reports', async () => {
      await taxReportReq.createTaxReport({ fiscalQuarter: '1', fiscalYear: '1999' });
      const taxReports = await taxReportReq.getAllTaxReports<TaxReport[]>();

      for (const { file, payments, ...taxReport } of taxReports) {
        expect(file).toEqual(fileShape());
        expect(payments).toEqual(expect.arrayContaining([paymentShape()]));
        expect(taxReport).toEqual(taxReportShape());
      }
    });
  });

  describe('getTaxReportById()', () => {
    it('should get tax report by id', async () => {
      const { id } = await taxReportReq.createTaxReport({ fiscalQuarter: '1', fiscalYear: '1995' });
      const { file, payments, ...taxReport } = await taxReportReq.getTaxReportById(id);

      expect(file).toEqual(fileShape());
      expect(payments).toEqual(expect.arrayContaining([paymentShape()]));
      expect(taxReport).toEqual(taxReportShape({ fiscalQuarter: 1, fiscalYear: 1995 }));
    });
  });

  describe('createTaxReport()', () => {
    it('should create tax report', async () => {
      const { id } = await taxReportReq.createTaxReport({ fiscalQuarter: '1', fiscalYear: '1996' });
      const { file, payments, ...taxReport } = await taxReportReq.getTaxReportById(id);

      expect(payments).toEqual(expect.arrayContaining([paymentShape()]));
      expect(taxReport).toEqual(taxReportShape({ fiscalQuarter: 1, fiscalYear: 1996 }));
      expect(file).toEqual(fileShape(getTaxReportFileDto({ fiscalQuarter: 1, fiscalYear: 1996 })));
    });

    it('should throw an error when trying to create duplicate tax report', async () => {
      await taxReportReq.createTaxReport({ fiscalQuarter: '2', fiscalYear: '1996' });
      const { message } = await taxReportReq.createTaxReport<TaxReportError>({
        fiscalQuarter: '2',
        fiscalYear: '1996',
      });

      expect(message).toEqual(TaxReportExceptionMessage.DuplicateTaxReport);
    });
  });

  describe('editTaxReportPayment()', () => {
    it('should edit payment', async () => {
      const { id, payments } = await taxReportReq.createTaxReport({
        fiscalQuarter: '1',
        fiscalYear: '1997',
      });

      for (const payment of payments) {
        await taxReportReq.editTaxReportPayment(id, payment.id, { isExempt: true });
      }

      const {
        file,
        payments: paymentsUpdated,
        ...taxReport
      } = await taxReportReq.getTaxReportById(id);

      expect(taxReport).toEqual(taxReportShape());
      expect(file).toEqual(fileShape());
      expect(paymentsUpdated).toEqual(expect.arrayContaining([paymentShape({ isExempt: true })]));
    });
  });

  describe('deleteTaxReport()', () => {
    it('should delete tax report', async () => {
      const taxReport = await taxReportReq.createTaxReport({
        fiscalQuarter: '1',
        fiscalYear: '1998',
      });
      const taxReportDeleted = await taxReportReq.deleteTaxReport(taxReport.id);
      const taxReportFileDeleted = await fileReq.getFileById(taxReport.fileId);

      const taxReportFound = await taxReportReq.getTaxReportById(taxReport.id);

      expect(taxReport).toEqual(taxReportShape(taxReportDeleted));
      expect(taxReportFileDeleted).toEqual({});
      expect(taxReportFound).toEqual({});
    });

    it('should throw an error when trying to delete report that does not exist', async () => {
      app.useLogger(false);

      const taxReportId = -1;
      const { message } = await taxReportReq.deleteTaxReport<TaxReportError>(taxReportId);
      expect(message).toEqual(TaxReportExceptionMessage.CouldNotDeleteTaxReportException);
    });
  });

  describe('emailTaxReport()', () => {
    it('should email tax report', async () => {
      const taxReport = await taxReportReq.createTaxReport({
        fiscalQuarter: '1',
        fiscalYear: '1993',
      });

      const exemptPayments = taxReport.payments.filter((payment) =>
        ['Edy Garcia', 'John Ferrigno'].includes(payment.name),
      );
      for (const exemptPayment of exemptPayments) {
        await taxReportReq.editTaxReportPayment(taxReport.id, exemptPayment.id, { isExempt: true });
      }

      spyOn(emailService, 'sendEmail').mockResolvedValueOnce({} as SentMessageInfo);

      const sentMessageInfo = await taxReportReq.sendEmail(taxReport.id.toString());
      expect(sentMessageInfo).toEqual({} as SentMessageInfo);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
