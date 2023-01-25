import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TaxReportService } from './tax-report.service';

class MockPrismaService {
  taxReport = {
    create: jest.fn(),
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
