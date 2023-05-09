import { Test, TestingModule } from '@nestjs/testing';
import { File, Prisma } from '@prisma/client';
import * as fsExtra from 'fs-extra';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { EnvService } from '../../env/env.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DeleteFileException,
  DuplicateFileException,
  EditFileThatDoesNotExistException,
  OverrideFileException,
  UploadFileException,
} from '../file.exception';
import { FileService } from '../file.service';
import { FileUpdateDto } from '../models/file.model';

const { spyOn, fn } = jest;

class MockPrismaService {
  file = {
    create: fn(),
    findFirst: fn(),
    delete: fn(),
    update: fn(),
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

  let fileBuffer: Buffer;

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

    fileBuffer = await readFile(join(__dirname, 'something.txt'));
  });

  describe('createFile()', () => {
    it('should throw an error when trying to create duplicate tax report', async () => {
      const fileDto = {} as Prisma.FileCreateInput;
      const duplicateFileDto = {} as File;
      spyOn(fileService as any, 'findDuplicateFile').mockResolvedValue(duplicateFileDto);

      await expect(fileService.createFile(fileDto, fileBuffer)).rejects.toThrow(
        DuplicateFileException,
      );
    });

    it('should create file', async () => {
      spyOn(fileService as any, 'findDuplicateFile').mockResolvedValue(null);
      spyOn(fileService as any, 'uploadFile').mockImplementation(fn);
      spyOn(prismaService.file, 'create');

      const fileDto = {} as Prisma.FileCreateInput;
      await fileService.createFile(fileDto, fileBuffer);

      expect((fileService as any).findDuplicateFile).toHaveBeenCalledWith(fileDto);
      expect(prismaService.file.create).toHaveBeenCalledWith({ data: fileDto });
      expect((fileService as any).uploadFile).toHaveBeenCalledWith(fileDto, fileBuffer);
    });
  });

  describe('editFile()', () => {
    it('should throw an error when trying to edit file that does not exists', async () => {
      const fileId = -1;
      const fileDto = {} as FileUpdateDto;

      spyOn(fileService as any, 'findFile').mockResolvedValue(null);

      await expect(fileService.editFile(fileId, fileDto, fileBuffer)).rejects.toThrow(
        EditFileThatDoesNotExistException,
      );
    });

    it('should throw an error when edited file attempts to override another file', async () => {
      const fileId = 1;
      const fileDto = {} as FileUpdateDto;
      const file = {} as File;

      spyOn(fileService as any, 'findFile').mockResolvedValue(file);
      spyOn(fileService as any, 'willOverrideFile').mockResolvedValue(true);

      await expect(fileService.editFile(fileId, fileDto, fileBuffer)).rejects.toThrow(
        OverrideFileException,
      );
    });

    it('should edit file', async () => {
      const fileId = 1;
      const fileDto = {} as FileUpdateDto;
      const file = {} as File;

      spyOn(fileService as any, 'findFile').mockResolvedValue(file);
      spyOn(fileService as any, 'willOverrideFile').mockResolvedValue(false);
      spyOn(fileService as any, 'uploadFile').mockImplementation(fn);

      await fileService.editFile(fileId, fileDto, fileBuffer);

      expect((fileService as any).findFile).toHaveBeenCalledWith(fileId);
      expect((fileService as any).uploadFile).toHaveBeenCalledWith(fileDto, fileBuffer);
      expect(prismaService.file.update).toHaveBeenCalledWith({
        where: { id: fileId },
        data: fileDto,
      });
    });
  });

  describe('deleteFile()', () => {
    it('should throw an error when trying to delete a file that does not exists', async () => {
      const file = { id: -1 } as File;

      spyOn(fileService as any, 'findFile').mockResolvedValue(null);

      await expect(fileService.deleteFile(file.id)).rejects.toThrow(DeleteFileException);
    });

    it('should delete file', async () => {
      const file = { id: 1 } as File;

      spyOn(fileService as any, 'findFile').mockResolvedValue(file);
      spyOn(prismaService.file, 'delete').mockResolvedValue(file);

      const fileDeleted = await fileService.deleteFile(file.id);
      expect(fileDeleted).toEqual(file);
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

  describe('uploadFile()', () => {
    it('should upload file', async () => {
      const fileDto = {} as Prisma.FileCreateInput;
      const fileBuffer = {} as Buffer;
      const filePath = '/test/file/service/upload-file.txt';

      spyOn(fileService as any, 'getUploadFilePath').mockImplementation(() => filePath);
      spyOn(fsExtra, 'ensureFile').mockImplementation(fn);
      spyOn(fsExtra, 'writeFile').mockImplementation(fn);

      await (fileService as any).uploadFile(fileDto, fileBuffer);

      expect((fileService as any).getUploadFilePath).toBeCalledWith(fileDto);
      expect(fsExtra.ensureFile).toHaveBeenCalledWith(filePath);
      expect(fsExtra.writeFile).toHaveBeenCalledWith(filePath, fileBuffer);
    });
  });

  describe('findFile()', () => {
    it('should return null when there is a file', async () => {
      const fileFound = null;
      const fileId = -1;

      spyOn(prismaService.file, 'findFirst').mockResolvedValue(fileFound);

      expect(await (fileService as any).findFile(fileId)).toBeNull();
    });

    it('should return file', async () => {
      const fileFound = {} as File;
      const fileId = -1;

      spyOn(prismaService.file, 'findFirst').mockResolvedValue(fileFound);

      expect(await (fileService as any).findFile(fileId)).toEqual(fileFound);
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

  describe('willOverrideFile()', () => {
    it('should return false if file name is empty', async () => {
      const file = { fileName: '' } as File;
      const fileDto = { fileName: '' } as FileUpdateDto;

      expect(await (fileService as any).willOverrideFile(file, fileDto)).toBeFalsy();
    });

    it('should return false if file destination is empty', async () => {
      const file = { fileDestination: '' } as File;
      const fileDto = { fileDestination: '' } as FileUpdateDto;

      expect(await (fileService as any).willOverrideFile(file, fileDto)).toBeFalsy();
    });

    it('should return false if file to override is not found', async () => {
      const file = { fileName: 'a.txt', fileDestination: 'a' } as File;
      const fileDto = { fileName: 'b.txt', fileDestination: 'b' } as FileUpdateDto;
      const fileToOverride = null;

      spyOn(prismaService.file, 'findFirst').mockResolvedValue(fileToOverride);

      expect(await (fileService as any).willOverrideFile(file, fileDto)).toBeFalsy();
    });

    it('should return true if file to override is found', async () => {
      const file = { fileName: 'a.txt', fileDestination: 'a' } as File;
      const fileDto = { fileName: 'b.txt', fileDestination: 'b' } as FileUpdateDto;
      const fileToOverride = { fileName: 'b.txt', fileDestination: 'b' } as File;

      spyOn(prismaService.file, 'findFirst').mockResolvedValue(fileToOverride);

      expect(await (fileService as any).willOverrideFile(file, fileDto)).toBeTruthy();
    });
  });
});
