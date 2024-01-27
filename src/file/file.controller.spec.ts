import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AppModule } from '../app/app.module';
import request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';
import { FileUpdateDto } from './file.model';

describe('FileController', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    req = request(app.getHttpServer());
    prismaService = module.get(PrismaService);

    await app.init();
    await prismaService.cleanDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createFile()', () => {
    it('should throw when creating duplicate file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'tax-report.xlsx',
        fileDestination: 'tax-report/1994/Q1',
      };

      await req
        .post('/file')
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tax-report.xlsx');

      const { statusCode } = await req
        .post('/file')
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tax-report.xlsx');

      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should create file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'create-file.txt',
        fileDestination: 'tax-report/1994/Q2',
      };

      const { body, statusCode } = await req
        .post('/file')
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tax-report.xlsx');

      expect(statusCode).toEqual(HttpStatus.CREATED);
      expect(body.id).toEqual(expect.any(Number));
      expect(body.fileName).toBe(fileDto.fileName);
      expect(body.fileDestination).toBe(fileDto.fileDestination);
    });
  });

  describe('editFile()', () => {
    it('should throw an error when trying to edit file that does not exists', async () => {
      const fileId = -1;
      const fileDto: FileUpdateDto = {
        fileName: 'tax-report.xlsx',
        fileDestination: 'tax-report/1993/Q1',
      };

      const { statusCode } = await req
        .patch(`/file/${fileId}`)
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tax-report.xlsx');

      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should throw an error when trying to override file', async () => {
      const [fileDto1, fileDto2] = [
        { fileName: 'tax-report.xlsx', fileDestination: 'tax-report/1993/Q2' },
        { fileName: 'tax-report.xlsx', fileDestination: 'tax-report/1993/Q3' },
      ];

      const file1 = await req
        .post('/file')
        .field('fileName', fileDto1.fileName)
        .field('fileDestination', fileDto1.fileDestination)
        .attach('file', './src/file/tax-report.xlsx');

      await req
        .post('/file')
        .field('fileName', fileDto2.fileName)
        .field('fileDestination', fileDto2.fileDestination)
        .attach('file', './src/file/tax-report.xlsx');

      const { statusCode } = await req
        .patch(`/file/${file1.body.id}`)
        .field('fileName', fileDto2.fileName)
        .field('fileDestination', fileDto2.fileDestination)
        .attach('file', './src/file/tax-report.xlsx');

      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should edit file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'tax-report.xlsx',
        fileDestination: 'tax-report/1993/Q4',
      };
      const fileUpdateDto: FileUpdateDto = {
        fileName: 'tax-report.xlsx',
        fileDestination: 'tax-report/1993/Q4',
      };

      const file = await req
        .post('/file')
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tax-report.xlsx');

      const { statusCode } = await req
        .patch(`/file/${file.body.id}`)
        .field('fileName', fileUpdateDto.fileName)
        .field('fileDestination', fileUpdateDto.fileDestination)
        .attach('file', './src/file/tax-report.xlsx');

      expect(statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('deleteFile()', () => {
    it('should throw an error when trying to delete file that does not exists', async () => {
      const fileId = -1;
      const { statusCode } = await req.delete(`/file/${fileId}`);

      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should delete file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'tax-report.xlsx',
        fileDestination: 'tax-report/1992/Q1',
      };

      const fileCreatedRes = await req
        .post('/file')
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tax-report.xlsx');

      const { body, statusCode } = await req.delete(`/file/${fileCreatedRes.body.id}`);

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(body).toEqual(fileCreatedRes.body);
    });
  });
});
