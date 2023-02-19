import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { TaxReportController } from './tax-report.controller';
import { TaxReportService } from './tax-report.service';

class MockTaxReportService {
  createTaxReport = jest.fn();
  deleteTaxReport = jest.fn();
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

  describe('createTaxReport()', () => {
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

  describe('deleteTaxReport()', () => {
    it('should delete tax report', async () => {
      const deleteTaxReportId = 1;

      await taxReportController.deleteTaxReport(deleteTaxReportId.toString());

      expect(taxReportService.deleteTaxReport).toHaveBeenCalledWith(
        deleteTaxReportId,
      );
    });

    it('should throw an error when trying to delete report that does not exist', async () => {
      jest.spyOn(taxReportService, 'deleteTaxReport').mockImplementation(() => {
        throw new Error();
      });

      const deleteTaxReportId = 1;

      try {
        await taxReportController.deleteTaxReport(deleteTaxReportId.toString());
      } catch (error) {
        expect(error).toEqual(expect.any(Error));
      }
    });
  });
});
