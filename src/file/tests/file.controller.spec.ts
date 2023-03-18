import { Test, TestingModule } from '@nestjs/testing';
import { File, Prisma } from '@prisma/client';
import { FileController } from '../file.controller';
import { FileService } from '../file.service';

const { spyOn, fn } = jest;

class MockFileService {
  createFile = fn();
  editFile = fn();
  deleteFile = fn();
  uploadFile = fn();
  getUploadFilePath = fn();
}

describe('FileController', () => {
  let fileController: FileController;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [{ provide: FileService, useClass: MockFileService }],
    }).compile();

    fileController = module.get(FileController);
    fileService = module.get(FileService);
  });

  describe('createFile()', () => {
    it('should upload and create file', async () => {
      spyOn(fileService, 'createFile');

      const fileDto = {} as Prisma.FileCreateInput;
      const fileMulter = { buffer: {} as Buffer } as Express.Multer.File;
      await fileController.createFile(fileDto, fileMulter);

      expect(fileService.createFile).toHaveBeenCalledWith(fileDto, fileMulter.buffer);
    });
  });

  describe('editFile()', () => {
    it('should edit file', async () => {
      const fileId = 1;
      const fileDto = {} as Prisma.FileCreateInput;
      const fileMulter = { buffer: {} as Buffer } as Express.Multer.File;

      await fileController.editFile(fileId.toString(), fileDto, fileMulter);

      expect(fileService.editFile).toHaveBeenCalledWith(fileId, fileDto, fileMulter.buffer);
    });
  });

  describe('deleteFile()', () => {
    it('should delete file', async () => {
      const file = { id: 1 } as File;
      spyOn(fileService, 'deleteFile').mockResolvedValue(file);

      await fileController.deleteFile(file.id.toString());
      expect(fileService.deleteFile).toHaveBeenCalledWith(file.id);
    });
  });
});
