import { Test, TestingModule } from '@nestjs/testing';
import { File, Prisma } from '@prisma/client';
import * as fsExtra from 'fs-extra';
import { join } from 'path';
import { EnvService } from '../../env/env.service';
import { PrismaService } from '../../prisma/prisma.service';
import { DuplicateFileException, UploadFileException } from '../file.exception';
import { FileService } from '../file.service';

const { spyOn } = jest;

class MockPrismaService {
  file = {
    create() {},
    findFirst() {},
  };
}

class MockEnvService {
  get mediaPath(): string {
    return null;
  }
}

describe('FileService', () => {
  let fileService: FileService;
  let prismaService: PrismaService;
  let envService: EnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        { provide: EnvService, useClass: MockEnvService },
        { provide: PrismaService, useClass: MockPrismaService },
      ],
    }).compile();

    fileService = module.get(FileService);
    prismaService = module.get(PrismaService);
    envService = module.get(EnvService);
  });

  describe('createFile()', () => {
    it('should throw an error when trying to create duplicate tax report', async () => {
      const fileDto = {} as Prisma.FileCreateInput;
      const duplicateFileDto = {} as File;
      spyOn(fileService as any, 'findDuplicateFile').mockResolvedValue(duplicateFileDto);

      await expect(fileService.createFile(fileDto)).rejects.toThrow(DuplicateFileException);
    });

    it('should create file', async () => {
      spyOn(fileService as any, 'findDuplicateFile').mockResolvedValue(null);
      spyOn(prismaService.file, 'create');

      const fileDto = {} as Prisma.FileCreateInput;
      await fileService.createFile(fileDto);

      expect(prismaService.file.create).toHaveBeenCalledWith({ data: fileDto });
    });
  });

  describe('uploadFile()', () => {
    it('should throw an error when trying to upload duplicate file', async () => {
      const file = {} as File;
      const fileDto = {} as Prisma.FileCreateInput;
      const fileBuffer = {} as Buffer;
      const filePath = '/test/file/service/upload-file.txt';

      spyOn(fileService as any, 'findDuplicateFile').mockResolvedValue(file);
      spyOn(fileService as any, 'getUploadFilePath').mockImplementation(() => filePath);
      spyOn(fsExtra, 'ensureFile').mockImplementation(() => Promise.resolve());
      spyOn(fsExtra, 'writeFile').mockImplementation(() => Promise.resolve());

      await expect(fileService.uploadFile(fileDto, fileBuffer)).rejects.toThrow(
        DuplicateFileException,
      );
    });

    it('should upload file', async () => {
      const fileDto = {} as Prisma.FileCreateInput;
      const fileBuffer = {} as Buffer;
      const filePath = '/test/file/service/upload-file.txt';

      spyOn(fileService as any, 'findDuplicateFile').mockResolvedValue(null);
      spyOn(fileService as any, 'getUploadFilePath').mockImplementation(() => filePath);
      spyOn(fsExtra, 'ensureFile').mockImplementation(() => Promise.resolve());
      spyOn(fsExtra, 'writeFile').mockImplementation(() => Promise.resolve());

      expect(await fileService.uploadFile(fileDto, fileBuffer)).toBeUndefined();
    });
  });

  describe('getUploadFilePath()', () => {
    it('should throw if media path is not set', () => {
      const fileDto = {} as Prisma.FileCreateInput;

      spyOn(envService, 'mediaPath', 'get').mockReturnValue(null);

      expect(() => {
        fileService.getUploadFilePath(fileDto);
      }).toThrow(UploadFileException);
    });

    it('should return upload file path', () => {
      const mediaPath = '/var/media';
      spyOn(envService, 'mediaPath', 'get').mockReturnValue(mediaPath);

      const fileDto = {
        fileName: 'something.txt',
        fileDestination: '/test/file/service',
      } as Prisma.FileCreateInput;
      const uploadFilePath = fileService.getUploadFilePath(fileDto);

      expect(uploadFilePath).toEqual(join(mediaPath, fileDto.fileDestination, fileDto.fileName));
    });
  });

  describe('findDuplicateFile()', () => {
    it('should return null where there is no duplicate file found', async () => {
      const fileDto = {} as Prisma.FileCreateInput;

      spyOn(prismaService.file, 'findFirst').mockResolvedValue(null);

      expect(await (fileService as any).findDuplicateFile(fileDto)).toBeNull();
    });

    it('should return duplicate file', async () => {
      const file = {} as File;
      const fileDto = {} as Prisma.FileCreateInput;

      spyOn(prismaService.file, 'findFirst').mockResolvedValue(file);

      expect(await (fileService as any).findDuplicateFile(fileDto)).toEqual(file);
    });
  });
});
