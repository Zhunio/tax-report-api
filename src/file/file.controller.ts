import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { File, Prisma } from '@prisma/client';
import { FileService } from './file.service';
import { FileUpdateDto } from './models/file.model';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createFile(
    @Body() fileDto: Prisma.FileCreateInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<File> {
    return this.fileService.createFile(fileDto, file.buffer);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  editFile(
    @Param('id') fileId: string,
    @Body() fileDto: FileUpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.editFile(
      parseInt(fileId, 10),
      fileDto,
      file.buffer,
    );
  }

  @Delete(':id')
  deleteFile(@Param('id') fileId: string): Promise<File> {
    return this.fileService.deleteFile(parseInt(fileId, 10));
  }
}
