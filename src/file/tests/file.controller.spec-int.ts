import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { FileController } from '../file.controller';
import { DuplicateFileException } from '../file.exception';
import { FileModule } from '../file.module';

describe('FileController (Integration)', () => {
  let fileController: FileController;
  let prismaService: PrismaService;

  let fileBuffer: Buffer;
  let fileMulter: Express.Multer.File;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FileModule],
    }).compile();

    prismaService = module.get(PrismaService);
    fileController = module.get(FileController);

    fileBuffer = await readFile(join(__dirname, 'something.txt'));
    fileMulter = { buffer: fileBuffer } as Express.Multer.File;
  });

  beforeEach(async () => {
    await prismaService.file.deleteMany();
  });

  describe('createFile()', () => {
    it('should throw an error when trying to create duplicate file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'create-duplicate-file.txt',
        fileDestination: '/test/file/controller',
      };

      await fileController.createFile(fileDto, fileMulter);
      await expect(fileController.createFile(fileDto, fileMulter)).rejects.toThrow(
        DuplicateFileException,
      );
    });

    it('should create file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'create-file.txt',
        fileDestination: '/test/file/controller',
      };

      const file = await fileController.createFile(fileDto, fileMulter);

      expect(file.id).toEqual(expect.any(Number));
      expect(file.fileName).toEqual(fileDto.fileName);
      expect(file.fileDestination).toEqual(fileDto.fileDestination);
    });
  });
});
