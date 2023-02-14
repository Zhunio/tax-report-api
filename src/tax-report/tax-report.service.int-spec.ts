import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AppModule } from '../app.module';
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
