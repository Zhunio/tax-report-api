import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import * as request from 'supertest';
import { PrismaService } from '../../prisma/prisma.service';
import { FileModule } from '../file.module';
import { FileUpdateDto } from '../models/file.model';

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

  describe('editFile()', () => {
    it('should throw an error when trying to edit file that does not exists', async () => {
      const fileId = -1;
      const fileDto: FileUpdateDto = {
        fileName: 'edit-file.txt',
        fileDestination: '/test/file/e2e',
      };

      const { statusCode } = await req
        .patch(`/file/${fileId}`)
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tests/something.txt');

      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should throw an error when trying to override file', async () => {
      const [fileDto1, fileDto2] = [
        { fileName: 'edit-file-1.txt', fileDestination: '/test/file/service' },
        { fileName: 'edit-file-2.txt', fileDestination: '/test/file/service' },
      ];

      const file1 = await req
        .post('/file')
        .field('fileName', fileDto1.fileName)
        .field('fileDestination', fileDto1.fileDestination)
        .attach('file', './src/file/tests/something.txt');

      await req
        .post('/file')
        .field('fileName', fileDto2.fileName)
        .field('fileDestination', fileDto2.fileDestination)
        .attach('file', './src/file/tests/something.txt');

      const { statusCode } = await req
        .patch(`/file/${file1.body.id}`)
        .field('fileName', fileDto2.fileName)
        .field('fileDestination', fileDto2.fileDestination)
        .attach('file', './src/file/tests/something.txt');

      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should edit file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'edit-file.txt',
        fileDestination: '/test/file/e2e',
      };
      const fileUpdateDto: FileUpdateDto = {
        fileName: 'edit-file-1.txt',
        fileDestination: '/test/file/e2e',
      };

      const file = await req
        .post('/file')
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tests/something.txt');

      const { statusCode } = await req
        .patch(`/file/${file.body.id}`)
        .field('fileName', fileUpdateDto.fileName)
        .field('fileDestination', fileUpdateDto.fileDestination)
        .attach('file', './src/file/tests/something.txt');

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
        fileName: 'delete-file.txt',
        fileDestination: '/test/file/e2e',
      };

      const fileCreatedRes = await req
        .post('/file')
        .field('fileName', fileDto.fileName)
        .field('fileDestination', fileDto.fileDestination)
        .attach('file', './src/file/tests/something.txt');

      const { body, statusCode } = await req.delete(`/file/${fileCreatedRes.body.id}`);

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(body).toEqual(fileCreatedRes.body);
    });
  });
});
