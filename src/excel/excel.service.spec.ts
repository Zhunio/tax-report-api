import { Test, TestingModule } from '@nestjs/testing';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { ExcelService } from './excel.service';

const excelPaymentShape = expect.objectContaining({
  type: expect.any(String),
  date: expect.any(String),
  number: expect.any(String),
  name: expect.any(String),
  method: expect.any(String),
  amount: expect.any(String),
  isExempt: expect.any(Boolean),
});

describe('ExcelService', () => {
  let excelService: ExcelService;
  let prismaService: PrismaService;
  let fileBuffer: Buffer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    excelService = module.get(ExcelService);
    prismaService = module.get(PrismaService);
    fileBuffer = await readFile(join(__dirname, './tax-report.xlsx'));
    
    prismaService.cleanDatabase()
  });

  it('should parse payments from excel file', async () => {
    const payments = await excelService.parsePayments(fileBuffer);
    expect(payments).toEqual(expect.arrayContaining([excelPaymentShape]));
  });
});
