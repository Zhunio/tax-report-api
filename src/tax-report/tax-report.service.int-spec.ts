import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AppModule } from '../app.module';
import { TaxReportController } from './tax-report.controller';
import { TaxReportService } from './tax-report.service';

describe('TaxReportController', () => {
  let taxReportController: TaxReportController;
  let taxReportService: TaxReportService;

  const today = new Date();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    taxReportController = app.get(TaxReportController);
    taxReportService = app.get(TaxReportService);
  });

  it('should create', () => {
    expect(taxReportController).toBeDefined();
  });

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
