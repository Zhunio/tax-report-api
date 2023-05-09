import { AppModule } from '@/app/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { TaxReportController } from '@/tax-report/controller/tax-report.controller';
import { DuplicateTaxReportException } from '@/tax-report/exceptions/tax-report.exception';
import { TaxReportCreate } from '@/tax-report/types/tax-report.model';
import { Test, TestingModule } from '@nestjs/testing';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('TaxReportController (Integration)', () => {
  let taxReportController: TaxReportController;
  let prismaService: PrismaService;
  let fileBuffer: Buffer;
  let fileMulter: Express.Multer.File;

  const today = new Date();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = app.get(PrismaService);
    taxReportController = app.get(TaxReportController);

    await prismaService.cleanDatabase();
    fileBuffer = await readFile(join(__dirname, '../files/', 'something.txt'));
    fileMulter = { buffer: fileBuffer } as Express.Multer.File;
  });

  describe('createTaxReport()', () => {
    it('should create tax report', async () => {
      const { fiscalQuarter, fiscalYear, fileName, fileDestination }: TaxReportCreate = {
        fiscalQuarter: '1',
        fiscalYear: today.getFullYear().toString(),
        fileName: `${today.getFullYear()}-Q1-tax-report.txt`,
        fileDestination: '/test/tax-report',
      };
      const taxReport = await taxReportController.createTaxReport(
        { fiscalQuarter, fiscalYear, fileName, fileDestination },
        fileMulter,
      );

      expect(taxReport).toEqual({
        id: expect.any(Number),
        fiscalQuarter: parseInt(fiscalQuarter, 10),
        fiscalYear: parseInt(fiscalYear, 10),
        fileId: expect.any(Number),
        file: {
          id: expect.any(Number),
          fileName,
          fileDestination,
        },
      });
    });

    it('should throw an error when trying to create duplicate tax report', async () => {
      let duplicateTaxReportException: DuplicateTaxReportException | null = null;

      const { fiscalQuarter, fiscalYear, fileName, fileDestination }: TaxReportCreate = {
        fiscalQuarter: '1',
        fiscalYear: today.getFullYear().toString(),
        fileName: `${today.getFullYear()}-Q1-tax-report.txt`,
        fileDestination: '/test/tax-report',
      };

      try {
        await taxReportController.createTaxReport(
          { fiscalQuarter, fiscalYear, fileName, fileDestination },
          fileMulter,
        );
        await taxReportController.createTaxReport(
          { fiscalQuarter, fiscalYear, fileName, fileDestination },
          fileMulter,
        );
      } catch (error) {
        duplicateTaxReportException = error;
      }

      expect(duplicateTaxReportException).toBeInstanceOf(DuplicateTaxReportException);
    });
  });

  describe('deleteTaxReport()', () => {
    it('should delete tax report', async () => {
      const { fiscalQuarter, fiscalYear, fileName, fileDestination }: TaxReportCreate = {
        fiscalQuarter: '3',
        fiscalYear: today.getFullYear().toString(),
        fileName: `${today.getFullYear()}-Q3-tax-report.txt`,
        fileDestination: '/test/tax-report',
      };

      const { id } = await taxReportController.createTaxReport(
        { fiscalQuarter, fiscalYear, fileName, fileDestination },
        fileMulter,
      );
      const taxReportDeleted = await taxReportController.deleteTaxReport(id.toString());

      expect(taxReportDeleted).toEqual({
        id: expect.any(Number),
        fiscalQuarter: parseInt(fiscalQuarter, 10),
        fiscalYear: parseInt(fiscalYear, 10),
        fileId: expect.any(Number),
        file: {
          id: expect.any(Number),
          fileName,
          fileDestination,
        },
      });
    });

    it('should throw an error when trying to delete report that does not exist', async () => {
      let deleteError: Error | null = null;
      const deleteTaxReportId = -1;

      try {
        await taxReportController.deleteTaxReport(`${deleteTaxReportId}`);
      } catch (error) {
        deleteError = error;
      }

      expect(deleteError).toBeInstanceOf(Error);
    });
  });
});
