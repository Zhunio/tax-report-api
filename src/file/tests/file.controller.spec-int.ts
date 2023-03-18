import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { FileController } from '../file.controller';
import {
  DeleteFileException,
  DuplicateFileException,
  EditFileThatDoesNotExistException,
  OverrideFileException,
} from '../file.exception';
import { FileModule } from '../file.module';
import { FileUpdateDto } from '../models/file.model';

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

  describe('editFile()', () => {
    it('should throw an error when trying to edit file that does not exists', async () => {
      const fileId = -1;
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'create-file.txt',
        fileDestination: '/test/file/controller',
      };

      await expect(fileController.editFile(fileId.toString(), fileDto, fileMulter)).rejects.toThrow(
        EditFileThatDoesNotExistException,
      );
    });

    it('should throw an error when trying to override file', async () => {
      const [fileDto1, fileDto2] = [
        { fileName: 'create-file-1.txt', fileDestination: '/test/file/service' },
        { fileName: 'create-file-2.txt', fileDestination: '/test/file/service' },
      ];
      const file1 = await fileController.createFile(fileDto1, fileMulter);
      await fileController.createFile(fileDto2, fileMulter);

      await expect(
        fileController.editFile(file1.id.toString(), { ...fileDto2 }, fileMulter),
      ).rejects.toThrow(OverrideFileException);
    });

    it('should edit file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'edit-file.txt',
        fileDestination: '/test/file/controller',
      };
      const fileUpdateDto: FileUpdateDto = {
        fileName: 'edit-file-change.txt',
        fileDestination: '/test/file/controller',
      };

      const newFile = await fileController.createFile(fileDto, fileMulter);
      const editedFile = await fileController.editFile(
        newFile.id.toString(),
        fileUpdateDto,
        fileMulter,
      );

      expect(editedFile.id).toEqual(newFile.id);
      expect(editedFile.fileName).toEqual(fileUpdateDto.fileName);
      expect(editedFile.fileDestination).toEqual(fileUpdateDto.fileDestination);
    });
  });

  describe('deleteFile()', () => {
    it('should throw an error when trying to delete file that does not exists', async () => {
      const fileId = -1;

      await expect(fileController.deleteFile(fileId.toString())).rejects.toThrow(
        DeleteFileException,
      );
    });

    it('should delete file', async () => {
      const fileDto: Prisma.FileCreateInput = {
        fileName: 'delete-file.txt',
        fileDestination: '/test/file/controller',
      };

      const file = await fileController.createFile(fileDto, fileMulter);
      const fileDeleted = await fileController.deleteFile(file.id.toString());

      expect(file.id).toEqual(fileDeleted.id);
      expect(file.fileName).toEqual(fileDeleted.fileName);
      expect(file.fileDestination).toEqual(fileDeleted.fileDestination);
    });
  });
});
