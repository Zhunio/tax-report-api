import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { PrismaService } from './prisma.service';

describe('PrismaService (Integration)', () => {
  let prismaService: PrismaService;

  const today = new Date();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = app.get(PrismaService);
  });

  it('should create', () => {
    expect(prismaService).toBeDefined();
  });

  it('should clean database', async () => {
    await prismaService.taxReport.createMany({
      data: [
        { fiscalQuarter: 1, fiscalYear: today.getFullYear() },
        { fiscalQuarter: 2, fiscalYear: today.getFullYear() },
        { fiscalQuarter: 3, fiscalYear: today.getFullYear() },
        { fiscalQuarter: 4, fiscalYear: today.getFullYear() },
      ],
    });

    await prismaService.cleanDatabase();
    const taxReports = await prismaService.taxReport.findMany();

    expect(taxReports.length).toBe(0);
  });
});
