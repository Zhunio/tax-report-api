import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';
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

    await prismaService.cleanDatabase();
  });

  it('should create', () => {
    expect(taxReportService).toBeDefined();
  });

  describe('createTaxReport()', () => {
    it('should create tax report', async () => {
      const createTaxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 1,
        fiscalYear: today.getFullYear(),
      };
      const taxReport = await taxReportService.createTaxReport(
        createTaxReportDto,
      );

      expect(taxReport.id).toEqual(expect.any(Number));
      expect(taxReport.fiscalQuarter).toBe(createTaxReportDto.fiscalQuarter);
      expect(taxReport.fiscalYear).toBe(createTaxReportDto.fiscalYear);
    });
  });

  describe('deleteTaxReport()', () => {
    it('should delete tax report', async () => {
      const createTaxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 1,
        fiscalYear: today.getFullYear(),
      };
      const { id } = await taxReportService.createTaxReport(createTaxReportDto);
      const taxReportDeleted = await taxReportService.deleteTaxReport(id);
      const taxReportFound = await prismaService.taxReport.findFirst({
        where: { id },
      });

      expect(taxReportDeleted.id).toEqual(id);
      expect(taxReportDeleted.fiscalQuarter).toBe(
        createTaxReportDto.fiscalQuarter,
      );
      expect(taxReportDeleted.fiscalYear).toBe(createTaxReportDto.fiscalYear);
      expect(taxReportFound).toBeNull();
    });

    it('should throw an error when trying to delete report that does not exist', async () => {
      const deleteTaxReportId = 1;

      try {
        await taxReportService.deleteTaxReport(deleteTaxReportId);
      } catch (error) {
        expect(error).toEqual(expect.any(Error));
      }
    });
  });
});
