import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { TaxReportController } from './tax-report.controller';
import { DuplicateTaxReportException } from './tax-report.exception';

describe('TaxReportController (Integration)', () => {
  let taxReportController: TaxReportController;
  let prismaService: PrismaService;

  const today = new Date();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = app.get(PrismaService);
    taxReportController = app.get(TaxReportController);

    await prismaService.cleanDatabase();
  });

  describe('createTaxReport()', () => {
    it('should create tax report', async () => {
      const taxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 1,
        fiscalYear: today.getFullYear(),
      };
      const taxReport = await taxReportController.createTaxReport(taxReportDto);

      expect(taxReport.id).toEqual(expect.any(Number));
      expect(taxReport.fiscalQuarter).toBe(taxReportDto.fiscalQuarter);
      expect(taxReport.fiscalYear).toBe(taxReportDto.fiscalYear);
    });

    it('should throw an error when trying to create duplicate tax report', async () => {
      const taxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 2,
        fiscalYear: today.getFullYear(),
      };

      await taxReportController.createTaxReport(taxReportDto);

      expect(taxReportController.createTaxReport(taxReportDto)).rejects.toThrow(
        DuplicateTaxReportException,
      );
    });
  });

  describe('deleteTaxReport()', () => {
    it('should delete tax report', async () => {
      const taxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 3,
        fiscalYear: today.getFullYear(),
      };

      const { id } = await taxReportController.createTaxReport(taxReportDto);
      const taxReportDeleted = await taxReportController.deleteTaxReport(id.toString());
      const taxReportFound = await prismaService.taxReport.findFirst({ where: { id } });

      expect(taxReportDeleted.id).toEqual(id);
      expect(taxReportDeleted.fiscalQuarter).toBe(taxReportDto.fiscalQuarter);
      expect(taxReportDeleted.fiscalYear).toBe(taxReportDto.fiscalYear);
      expect(taxReportFound).toBeNull();
    });

    it('should throw an error when trying to delete report that does not exist', () => {
      const deleteTaxReportId = -1;

      expect(taxReportController.deleteTaxReport(`${deleteTaxReportId}`)).rejects.toThrow(Error);
    });
  });
});
