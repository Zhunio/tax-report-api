import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { File, Prisma } from '@prisma/client';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createFile(
    @Body() fileDto: Prisma.FileCreateInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<File> {
    await this.fileService.uploadFile(fileDto, file.buffer);
    return this.fileService.createFile(fileDto);
  }
}
