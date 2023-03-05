import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { FileController } from '../file.controller';
import { FileService } from '../file.service';

const { spyOn, fn } = jest;

class MockFileService {
  createFile = fn();
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
      spyOn(fileService, 'uploadFile');
      spyOn(fileService, 'createFile');

      const fileDto = {} as Prisma.FileCreateInput;
      const fileMulter = { buffer: {} as Buffer } as Express.Multer.File;
      await fileController.createFile(fileDto, fileMulter);

      expect(fileService.uploadFile).toHaveBeenCalledWith(fileDto, fileMulter.buffer);
      expect(fileService.createFile).toHaveBeenCalledWith(fileDto);
    });
  });
});
