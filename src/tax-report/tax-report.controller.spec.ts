import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { TaxReportController } from './tax-report.controller';
import { DuplicateTaxReportException } from './tax-report.exception';
import { TaxReportService } from './tax-report.service';

class MockTaxReportService {
  createTaxReport = jest.fn();
  deleteTaxReport = jest.fn();
}

const { spyOn } = jest;

describe('TaxReportController', () => {
  let taxReportController: TaxReportController;
  let taxReportService: TaxReportService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaxReportController],
      providers: [{ provide: TaxReportService, useClass: MockTaxReportService }],
    }).compile();

    taxReportController = app.get(TaxReportController);
    taxReportService = app.get(TaxReportService);
  });

  describe('createTaxReport()', () => {
    it('should create tax report', async () => {
      const taxReportDto = {} as Prisma.TaxReportCreateInput;
      await taxReportController.createTaxReport(taxReportDto);

      expect(taxReportService.createTaxReport).toHaveBeenCalledWith(taxReportDto);
    });

    it('should throw an error when trying to create duplicate tax report', () => {
      spyOn(taxReportService, 'createTaxReport').mockImplementation(() => {
        throw new DuplicateTaxReportException();
      });
      const taxReportDto = {} as Prisma.TaxReportCreateInput;

      expect(taxReportController.createTaxReport(taxReportDto)).rejects.toThrow(
        DuplicateTaxReportException,
      );
    });
  });

  describe('deleteTaxReport()', () => {
    it('should delete tax report', async () => {
      const deleteTaxReportId = 1;
      await taxReportController.deleteTaxReport(`${deleteTaxReportId}`);

      expect(taxReportService.deleteTaxReport).toHaveBeenCalledWith(deleteTaxReportId);
    });

    it('should throw an error when trying to delete report that does not exist', () => {
      spyOn(taxReportService, 'deleteTaxReport').mockImplementation(() => {
        throw new Error();
      });
      const deleteTaxReportId = 1;

      expect(taxReportController.deleteTaxReport(`${deleteTaxReportId}`)).rejects.toThrow(Error);
    });
  });
});
