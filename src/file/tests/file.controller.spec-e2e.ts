import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import * as request from 'supertest';
import { PrismaService } from '../../prisma/prisma.service';
import { FileModule } from '../file.module';

describe('FileController (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FileModule],
    }).compile();

    app = module.createNestApplication();
    req = request(app.getHttpServer());
    prismaService = module.get(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await prismaService.file.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createFile()', () => {
    it('should throw when creating duplicate file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'create-duplicate-file.txt',
        fileDestination: '/test/file/e2e',
      };

      await req
        .post('/file')
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tests/something.txt');

      const { statusCode } = await req
        .post('/file')
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tests/something.txt');

      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should create file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'create-file.txt',
        fileDestination: '/test/file/e2e',
      };

      const { body, statusCode } = await req
        .post('/file')
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tests/something.txt');

      expect(statusCode).toEqual(HttpStatus.CREATED);
      expect(body.id).toEqual(expect.any(Number));
      expect(body.fileName).toBe(fileDto.fileName);
      expect(body.fileDestination).toBe(fileDto.fileDestination);
    });
  });
});
