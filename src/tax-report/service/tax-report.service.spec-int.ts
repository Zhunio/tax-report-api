import { AppModule } from '@/app/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { DuplicateTaxReportException } from '@/tax-report/exceptions/tax-report.exception';
import { TaxReportService } from '@/tax-report/service/tax-report.service';
import { TaxReportCreate } from '@/tax-report/types/tax-report.model';

import { Test, TestingModule } from '@nestjs/testing';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('TaxReportService (Integration)', () => {
  let taxReportService: TaxReportService;
  let prismaService: PrismaService;
  let fileBuffer: Buffer;

  const today = new Date();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = app.get(PrismaService);
    taxReportService = app.get(TaxReportService);
    fileBuffer = await readFile(join(__dirname, '../files/', 'something.txt'));

    await prismaService.cleanDatabase();
  });

  describe('createTaxReport()', () => {
    it('should create tax report', async () => {
      const { fiscalQuarter, fiscalYear, fileName, fileDestination }: TaxReportCreate = {
        fiscalQuarter: '1',
        fiscalYear: today.getFullYear().toString(),
        fileName: `${today.getFullYear()}-Q1-tax-report.txt`,
        fileDestination: '/test/tax-report',
      };
      const taxReport = await taxReportService.createTaxReport(
        { fiscalQuarter, fiscalYear, fileName, fileDestination },
        fileBuffer,
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
      const taxReportDto: TaxReportCreate = {
        fiscalQuarter: '2',
        fiscalYear: today.getFullYear().toString(),
        fileName: `${today.getFullYear()}-Q2-tax-report.txt`,
        fileDestination: '/test/tax-report',
      };

      try {
        await taxReportService.createTaxReport(taxReportDto, fileBuffer);
        await taxReportService.createTaxReport(taxReportDto, fileBuffer);
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
      const { id } = await taxReportService.createTaxReport(
        { fiscalQuarter, fiscalYear, fileName, fileDestination },
        fileBuffer,
      );
      const taxReportDeleted = await taxReportService.deleteTaxReport(id);

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

    it('should throw an error when trying to delete tax report that does not exist', async () => {
      let deleteError: Error | null = null;
      const deleteTaxReportId = 1;

      try {
        await taxReportService.deleteTaxReport(deleteTaxReportId);
      } catch (error) {
        deleteError = error;
      }

      expect(deleteError).toBeInstanceOf(Error);
    });
  });
});
