import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, TaxReport } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DuplicateTaxReportException } from './tax-report.exception';
import { TaxReportService } from './tax-report.service';

class MockPrismaService {
  taxReport = {
    create: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  };
}

const { spyOn } = jest;

describe('TaxReportService', () => {
  let taxReportService: TaxReportService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [TaxReportService, { provide: PrismaService, useClass: MockPrismaService }],
    }).compile();

    taxReportService = app.get<TaxReportService>(TaxReportService);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  describe('createTaxReport()', () => {
    it('should create tax report', async () => {
      spyOn(prismaService.taxReport, 'findFirst').mockReturnValue(null);

      const taxReportDto = {} as Prisma.TaxReportCreateInput;
      await taxReportService.createTaxReport(taxReportDto);

      expect(prismaService.taxReport.create).toHaveBeenCalledWith({
        data: taxReportDto,
      });
    });

    it('should throw an error when trying to create duplicate tax report', async () => {
      const taxReport = {} as TaxReport;
      const taxReportDto = {} as Prisma.TaxReportCreateInput;
      spyOn(prismaService.taxReport, 'findFirst').mockResolvedValue(taxReport);

      expect(taxReportService.createTaxReport(taxReportDto)).rejects.toThrow(
        DuplicateTaxReportException,
      );
    });
  });

  describe('deleteTaxReport()', () => {
    it('should delete tax report', async () => {
      const deleteTaxReportId = 1;

      await taxReportService.deleteTaxReport(deleteTaxReportId);

      expect(prismaService.taxReport.delete).toHaveBeenCalledWith({
        where: { id: deleteTaxReportId },
      });
    });

    it('should throw an error when trying to delete report that does not exist', async () => {
      spyOn(prismaService.taxReport, 'delete').mockImplementation(() => {
        throw new Error();
      });
      const deleteTaxReportId = 1;

      expect(taxReportService.deleteTaxReport(deleteTaxReportId)).rejects.toThrow(Error);
    });
  });
});
