import { Test, TestingModule } from '@nestjs/testing';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { ExcelService } from './excel.service';

describe('ExcelService', () => {
  let service: ExcelService;
  let fileBuffer: Buffer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelService],
    }).compile();

    service = module.get<ExcelService>(ExcelService);
    fileBuffer = await readFile(join(__dirname, './tax-report.xlsx'));
  });

  it('should parse payments from excel file', async () => {
    const payments = await service.parsePayments(fileBuffer);

    expect(payments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: expect.any(String),
          date: expect.any(String),
          number: expect.any(String),
          name: expect.any(String),
          method: expect.any(String),
          total: expect.any(String),
          isExempt: expect.any(Boolean),
        }),
      ]),
    );
  });
});
