import { AppModule } from '@/app/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { TaxReportCreate } from '@/tax-report/types/tax-report.model';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('TaxController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let req: request.SuperTest<request.Test>;

  const today = new Date();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get(PrismaService);

    req = request(app.getHttpServer());

    await app.init();
    await prismaService.cleanDatabase();
  });

  describe('/tax-report (POST)', () => {
    it('should create tax report', async () => {
      const { fiscalQuarter, fiscalYear, fileName, fileDestination }: TaxReportCreate = {
        fiscalQuarter: '1',
        fiscalYear: today.getFullYear().toString(),
        fileName: `${today.getFullYear()}-Q1-tax-report.txt`,
        fileDestination: '/test/tax-report',
      };

      const { body, statusCode } = await req
        .post('/tax-report')
        .field('fiscalQuarter', fiscalQuarter)
        .field('fiscalYear', fiscalYear)
        .field('fileName', fileName)
        .field('fileDestination', fileDestination)
        .attach('file', './src/tax-report/files/something.txt');

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(body).toEqual({
        id: expect.any(Number),
        fiscalQuarter: parseInt(fiscalQuarter, 10),
        fiscalYear: parseInt(fiscalYear, 10),
        fileId: expect.any(Number),
        file: {
          id: expect.any(Number),
          fileName,
          fileDestination,
        },
      });
    });

    it('should throw an error when trying to create duplicate tax report', async () => {
      const { fiscalQuarter, fiscalYear, fileName, fileDestination }: TaxReportCreate = {
        fiscalQuarter: '2',
        fiscalYear: today.getFullYear().toString(),
        fileName: `${today.getFullYear()}-Q2-tax-report.txt`,
        fileDestination: '/test/tax-report',
      };

      await req
        .post('/tax-report')
        .field('fiscalQuarter', fiscalQuarter)
        .field('fiscalYear', fiscalYear)
        .field('fileName', fileName)
        .field('fileDestination', fileDestination)
        .attach('file', './src/tax-report/files/something.txt');
      const { error, statusCode } = await req
        .post('/tax-report')
        .field('fiscalQuarter', fiscalQuarter)
        .field('fiscalYear', fiscalYear)
        .field('fileName', fileName)
        .field('fileDestination', fileDestination)
        .attach('file', './src/tax-report/files/something.txt');

      expect(error).toEqual(expect.any(Error));
      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('/tax-report (DELETE)', () => {
    it('should delete tax report', async () => {
      const { fiscalQuarter, fiscalYear, fileName, fileDestination }: TaxReportCreate = {
        fiscalQuarter: '3',
        fiscalYear: today.getFullYear().toString(),
        fileName: `${today.getFullYear()}-Q3-tax-report.txt`,
        fileDestination: '/test/tax-report',
      };

      const createRes = await req
        .post('/tax-report')
        .field('fiscalQuarter', fiscalQuarter)
        .field('fiscalYear', fiscalYear)
        .field('fileName', fileName)
        .field('fileDestination', fileDestination)
        .attach('file', './src/tax-report/files/something.txt');

      const deleteRes = await req.delete('/tax-report/' + createRes.body.id);

      expect(deleteRes.statusCode).toEqual(HttpStatus.OK);
      expect(deleteRes.body).toEqual(createRes.body);
    });

    it('should throw an error when trying to delete report that does not exist', async () => {
      // disable logging to not see error in terminal
      app.useLogger(false);

      const { statusCode, error } = await req.delete('/tax-report/-1');

      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error).toEqual(expect.any(Error));
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
