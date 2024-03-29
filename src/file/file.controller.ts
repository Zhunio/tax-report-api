import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { File, Prisma } from '@prisma/client';
import { Response } from 'express';
import { FileService } from './file.service';
import { FileUpdateDto } from './file.model';
import { AuthGuard } from '../auth/auth.guard';

@Controller('file')
@UseGuards(AuthGuard)
export class FileController {
  constructor(private fileService: FileService) {}

  @Get(':id')
  async getFileById(@Param('id') fileId: string) {
    return this.fileService.getFileById(parseInt(fileId, 10));
  }

  @Get('buffer/:id')
  async getFileBuffer(@Param('id') fileId: string) {
    return this.fileService.getFileBuffer(parseInt(fileId));
  }

  @Get('download/:id')
  async downloadFile(@Param('id') fileId: string, @Res() res: Response) {
    const file = await this.fileService.findFile(parseInt(fileId, 10));
    const filePath = this.fileService.getUploadFilePath(file);

    res.download(filePath, file.fileName);
  }

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
