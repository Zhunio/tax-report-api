import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TaxReportService } from './tax-report.service';

class MockPrismaService {
  taxReport = {
    create: jest.fn(),
    delete: jest.fn(),
  };
}

describe('TaxReportService', () => {
  let taxReportService: TaxReportService;
  let prismaService: PrismaService;

  const today = new Date();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        TaxReportService,
        { provide: PrismaService, useClass: MockPrismaService },
      ],
    }).compile();

    taxReportService = app.get<TaxReportService>(TaxReportService);
    prismaService = app.get<PrismaService>(PrismaService);
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

      await taxReportService.createTaxReport(createTaxReportDto);

      expect(prismaService.taxReport.create).toHaveBeenCalledWith({
        data: createTaxReportDto,
      });
    });
  });

  describe('deleteTaxReport()', () => {
    it('should delete tax report', async () => {
      const deleteTaxReportId = 1;

      await taxReportService.deleteTaxReport(deleteTaxReportId);

      expect(prismaService.taxReport.delete).toHaveBeenCalledWith({
        where: {
          id: deleteTaxReportId,
        },
      });
    });

    it('should throw an error when trying to delete report that does not exist', async () => {
      jest.spyOn(prismaService.taxReport, 'delete').mockImplementation(() => {
        throw new Error();
      });

      const deleteTaxReportId = 1;

      try {
        await taxReportService.deleteTaxReport(deleteTaxReportId);
      } catch (error) {
        expect(error).toEqual(expect.any(Error));
      }
    });
  });
});
