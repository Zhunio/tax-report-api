import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { TaxReportController } from './tax-report.controller';

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

  it('should create', () => {
    expect(taxReportController).toBeDefined();
  });

  describe('createTaxReport()', () => {
    it('should create tax report', async () => {
      const createTaxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 1,
        fiscalYear: today.getFullYear(),
      };
      const taxReport = await taxReportController.createTaxReport(
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
      const { id } = await taxReportController.createTaxReport(
        createTaxReportDto,
      );
      const taxReportDeleted = await taxReportController.deleteTaxReport(
        id.toString(),
      );
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
        await taxReportController.deleteTaxReport(deleteTaxReportId.toString());
      } catch (error) {
        expect(error).toEqual(expect.any(Error));
      }
    });
  });
});
