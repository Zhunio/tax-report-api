import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { DuplicateTaxReportException } from './tax-report.exception';
import { TaxReportService } from './tax-report.service';

describe('TaxReportService (Integration)', () => {
  let taxReportService: TaxReportService;
  let prismaService: PrismaService;

  const today = new Date();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = app.get(PrismaService);
    taxReportService = app.get(TaxReportService);
  });

  beforeEach(async () => {
    await prismaService.cleanDatabase();
  });

  describe('createTaxReport()', () => {
    it('should create tax report', async () => {
      const taxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 1,
        fiscalYear: today.getFullYear(),
      };
      const taxReport = await taxReportService.createTaxReport(taxReportDto);

      expect(taxReport.id).toEqual(expect.any(Number));
      expect(taxReport.fiscalQuarter).toBe(taxReportDto.fiscalQuarter);
      expect(taxReport.fiscalYear).toBe(taxReportDto.fiscalYear);
    });

    it('should throw an error when trying to create duplicate tax report', async () => {
      const taxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 1,
        fiscalYear: today.getFullYear(),
      };

      await taxReportService.createTaxReport(taxReportDto);
      expect(taxReportService.createTaxReport(taxReportDto)).rejects.toThrow(
        DuplicateTaxReportException,
      );
    });
  });

  describe('deleteTaxReport()', () => {
    it('should delete tax report', async () => {
      const taxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 1,
        fiscalYear: today.getFullYear(),
      };
      const { id } = await taxReportService.createTaxReport(taxReportDto);
      const taxReportDeleted = await taxReportService.deleteTaxReport(id);
      const taxReportFound = await prismaService.taxReport.findFirst({ where: { id } });

      expect(taxReportDeleted.id).toEqual(id);
      expect(taxReportDeleted.fiscalQuarter).toBe(taxReportDto.fiscalQuarter);
      expect(taxReportDeleted.fiscalYear).toBe(taxReportDto.fiscalYear);
      expect(taxReportFound).toBeNull();
    });

    it('should throw an error when trying to delete tax report that does not exist', async () => {
      const deleteTaxReportId = 1;

      expect(taxReportService.deleteTaxReport(deleteTaxReportId)).rejects.toThrow(Error);
    });
  });
});
