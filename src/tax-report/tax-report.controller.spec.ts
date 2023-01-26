import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { TaxReportController } from './tax-report.controller';
import { TaxReportService } from './tax-report.service';

class MockTaxReportService {
  createTaxReport = jest.fn();
}

describe('TaxReportController', () => {
  let taxReportController: TaxReportController;
  let taxReportService: TaxReportService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaxReportController],
      providers: [
        { provide: TaxReportService, useClass: MockTaxReportService },
      ],
    }).compile();

    taxReportController = app.get<TaxReportController>(TaxReportController);
    taxReportService = app.get<TaxReportService>(TaxReportService);
  });

  it('should create', () => {
    expect(taxReportController).toBeDefined();
  });

  it('should create tax report', async () => {
    const createTaxReportDto: Prisma.TaxReportCreateInput = {
      fiscalQuarter: 1,
      fiscalYear: 2020,
    };
    await taxReportController.createTaxReport(createTaxReportDto);

    expect(taxReportService.createTaxReport).toHaveBeenCalledWith(
      createTaxReportDto,
    );
  });
});
