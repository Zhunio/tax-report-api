import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TaxController (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  const today = new Date();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    req = request(app.getHttpServer());

    await app.init();
  });

  describe('/tax-report (POST)', () => {
    it('should create tax report', async () => {
      const createTaxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 1,
        fiscalYear: today.getFullYear(),
      };

      const createRes = await req.post('/tax-report').send(createTaxReportDto);

      expect(createRes.statusCode).toBe(HttpStatus.CREATED);
      expect(createRes.body.id).toEqual(expect.any(Number));
      expect(createRes.body.fiscalQuarter).toBe(
        createTaxReportDto.fiscalQuarter,
      );
      expect(createRes.body.fiscalYear).toBe(createTaxReportDto.fiscalYear);
    });
  });

  describe('/tax-report (DELETE)', () => {
    it('should delete tax report', async () => {
      const createTaxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 1,
        fiscalYear: today.getFullYear(),
      };

      const createRes = await req.post('/tax-report').send(createTaxReportDto);

      expect(createRes.body.id).toEqual(expect.any(Number));
      expect(createRes.body.fiscalQuarter).toBe(
        createTaxReportDto.fiscalQuarter,
      );
      expect(createRes.body.fiscalYear).toBe(createTaxReportDto.fiscalYear);

      const deleteRes = await req.delete('/tax-report/' + createRes.body.id);

      expect(deleteRes.statusCode).toEqual(HttpStatus.OK);
      expect(deleteRes.body.id).toBe(createRes.body.id);
      expect(deleteRes.body.fiscalQuarter).toBe(createRes.body.fiscalQuarter);
      expect(deleteRes.body.fiscalYear).toBe(createRes.body.fiscalYear);
    });

    it('should throw an error when trying to delete report that does not exist', async () => {
      // disable logging to not see error in terminal
      app.useLogger(false);

      const deleteRes = await req.delete('/tax-report/1');

      expect(deleteRes.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(deleteRes.error).toEqual(expect.any(Error));
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
