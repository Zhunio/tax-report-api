import { Test, TestingModule } from '@nestjs/testing';
import { File, Prisma } from '@prisma/client';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { EnvService } from '../../env/env.service';
import { PrismaService } from '../../prisma/prisma.service';
import { DeleteFileException, DuplicateFileException } from '../file.exception';
import { FileModule } from '../file.module';
import { FileService } from '../file.service';

describe('FileService (Integration)', () => {
  let fileService: FileService;
  let prismaService: PrismaService;
  let envService: EnvService;

  let fileBuffer: Buffer;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FileModule],
    }).compile();

    fileService = module.get(FileService);
    prismaService = module.get(PrismaService);
    envService = module.get(EnvService);

    fileBuffer = await readFile(join(__dirname, 'something.txt'));
  });

  beforeEach(async () => {
    await prismaService.file.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('createFile()', () => {
    it('should throw an error when trying to create duplicate file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'create-file.txt',
        fileDestination: '/test/file/service',
      };

      await fileService.createFile(fileDto);
      await expect(fileService.createFile(fileDto)).rejects.toThrow(DuplicateFileException);
    });

    it('should create file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'create-duplicate-file.txt',
        fileDestination: '/test/file/service',
      };

      const file = await fileService.createFile(fileDto);
      expect(file.id).toEqual(expect.any(Number));
      expect(file.fileName).toEqual(fileDto.fileName);
      expect(file.fileDestination).toEqual(fileDto.fileDestination);
    });
  });

  describe('deleteFile()', () => {
    it('should throw an error when trying to delete a file that does not exists', async () => {
      const fileId = -1;

      await expect(fileService.deleteFile(fileId)).rejects.toThrow(DeleteFileException);
    })

    it('should delete file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'create-file.txt',
        fileDestination: '/test/file/service',
      };

      const file = await fileService.createFile(fileDto);
      expect(file.id).toEqual(expect.any(Number));
      expect(file.fileName).toEqual(fileDto.fileName);
      expect(file.fileDestination).toEqual(fileDto.fileDestination);
    })
  })

  describe('uploadFile()', () => {
    it('should throw an error when trying to upload duplicate file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'upload-duplicate-file.txt',
        fileDestination: '/test/file/service',
      };

      await fileService.createFile(fileDto);
      await expect(fileService.uploadFile(fileDto, fileBuffer)).rejects.toThrow(
        DuplicateFileException,
      );
    });

    it('should upload file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'upload-file.txt',
        fileDestination: '/test/file/service',
      };

      expect(await fileService.uploadFile(fileDto, fileBuffer)).toBeUndefined();
    });
  });

  describe('getUploadFilePath()', () => {
    it('should return the upload file path', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'something.txt',
        fileDestination: '/test/file/service',
      };

      const uploadFilePath: string = await (fileService as any).getUploadFilePath(fileDto);

      expect(uploadFilePath).toEqual(
        join(envService.mediaPath, fileDto.fileDestination, fileDto.fileName),
      );
    });
  });

  describe('findDuplicateFile()', () => {
    it('should return null where is no duplicate file found', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'something.txt',
        fileDestination: '/test/file/service',
      };

      expect(await (fileService as any).findDuplicateFile(fileDto)).toBeNull();
    });

    it('should return duplicate file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'something.txt',
        fileDestination: '/test/file/service',
      };

      await fileService.createFile(fileDto);
      const duplicateFile: File = await (fileService as any).findDuplicateFile(fileDto);

      expect(duplicateFile.id).toEqual(expect.any(Number));
      expect(duplicateFile.fileName).toEqual(fileDto.fileName);
      expect(duplicateFile.fileDestination).toEqual(fileDto.fileDestination);
    });
  });
});
