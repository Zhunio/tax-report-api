import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';

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
      const taxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 1,
        fiscalYear: today.getFullYear(),
      };

      const { body, statusCode } = await req.post('/tax-report').send(taxReportDto);

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(body.id).toEqual(expect.any(Number));
      expect(body.fiscalQuarter).toBe(taxReportDto.fiscalQuarter);
      expect(body.fiscalYear).toBe(taxReportDto.fiscalYear);
    });

    it('should throw an error when trying to create duplicate tax report', async () => {
      const taxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 2,
        fiscalYear: today.getFullYear(),
      };

      await req.post('/tax-report').send(taxReportDto);
      const { error, statusCode } = await req.post('/tax-report').send(taxReportDto);

      expect(error).toEqual(expect.any(Error));
      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('/tax-report (DELETE)', () => {
    it('should delete tax report', async () => {
      const taxReportDto: Prisma.TaxReportCreateInput = {
        fiscalQuarter: 3,
        fiscalYear: today.getFullYear(),
      };

      const createRes = await req.post('/tax-report').send(taxReportDto);
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
