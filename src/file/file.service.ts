import { Injectable } from '@nestjs/common';
import { File, Prisma } from '@prisma/client';
import { ensureFile, writeFile } from 'fs-extra';
import { format, join, parse } from 'path';
import { EnvService } from '../env/env.service';
import { PrismaService } from '../prisma/prisma.service';
import { DuplicateFileException, UploadFileException } from './file.exception';

@Injectable()
export class FileService {
  constructor(
    private envService: EnvService,
    private prismaService: PrismaService,
  ) {}

  async createFile(fileDto: Prisma.FileCreateInput): Promise<File> {
    const isDuplicateFileFound = await this.findDuplicateFile(fileDto);
    if (isDuplicateFileFound) {
      throw new DuplicateFileException();
    }

    return this.prismaService.file.create({
      data: fileDto,
    });
  }

  async uploadFile(
    fileDto: Prisma.FileCreateInput,
    fileBuffer: Buffer,
  ): Promise<void> {
    const isDuplicateFileFound = await this.findDuplicateFile(fileDto);
    if (isDuplicateFileFound) {
      throw new DuplicateFileException();
    }

    try {
      const uploadFilePath = this.getUploadFilePath(fileDto);
      await ensureFile(uploadFilePath);
      await writeFile(uploadFilePath, fileBuffer);
    } catch (e) {
      throw new UploadFileException({ cause: e });
    }
  }

  getUploadFilePath(fileDto: Prisma.FileCreateInput): string {
    const mediaPath = this.envService.mediaPath;
    if (!mediaPath) {
      throw new UploadFileException();
    }

    const uploadFilePath = parse(
      format({
        dir: join(mediaPath, fileDto.fileDestination),
        base: fileDto.fileName,
      }),
    );

    return format({
      dir: uploadFilePath.dir,
      name: uploadFilePath.name,
      ext: uploadFilePath.ext,
    });
  }

  private findDuplicateFile(
    fileDto: Prisma.FileCreateInput,
  ): Promise<File | null> {
    return this.prismaService.file.findFirst({
      where: {
        fileName: fileDto.fileName,
        fileDestination: fileDto.fileDestination,
      },
    });
  }
}
