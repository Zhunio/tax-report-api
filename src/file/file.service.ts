import { Injectable } from '@nestjs/common';
import { File, Prisma } from '@prisma/client';
import { ensureFile, writeFile } from 'fs-extra';
import { readFile } from 'fs/promises';
import { format, join, parse } from 'path';
import { EnvService } from '../env/env.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  DeleteFileException,
  DuplicateFileException,
  EditFileThatDoesNotExistException,
  FileNotFoundException,
  OverrideFileException,
  UploadFileException,
} from './file.exception';
import { FileUpdateDto } from './models/file.model';

@Injectable()
export class FileService {
  constructor(
    private envService: EnvService,
    private prismaService: PrismaService,
  ) {}

  async getFileById(fileId: number) {
    try {
      const file = await this.findFile(fileId);
      return file;
    } catch (e) {
      throw new FileNotFoundException();
    }
  }

  async getFileBuffer(fileId: number) {
    try {
      const file = await this.findFile(fileId);
      const uploadFilePath = this.getUploadFilePath(file);
      return await readFile(uploadFilePath);
    } catch (e) {
      throw new FileNotFoundException();
    }
  }

  async createFile(
    fileDto: Prisma.FileCreateInput,
    fileBuffer: Buffer,
  ): Promise<File> {
    const isDuplicateFileFound = await this.findDuplicateFile(fileDto);
    if (isDuplicateFileFound) {
      throw new DuplicateFileException();
    }

    await this.uploadFile(fileDto, fileBuffer);

    return this.prismaService.file.create({
      data: fileDto,
    });
  }

  async editFile(
    fileId: number,
    fileDto: FileUpdateDto,
    fileBuffer: Buffer,
  ): Promise<File> {
    const fileToUpdate = await this.findFile(fileId);
    if (!fileToUpdate) {
      throw new EditFileThatDoesNotExistException();
    }

    const willOverrideFile = await this.willOverrideFile(fileToUpdate, fileDto);
    if (willOverrideFile) {
      throw new OverrideFileException();
    }

    await this.uploadFile(fileToUpdate, fileBuffer);

    return this.prismaService.file.update({
      where: { id: fileId },
      data: fileDto,
    });
  }

  async deleteFile(fileId: number) {
    const isFileFound = await this.findFile(fileId);

    if (!isFileFound) {
      throw new DeleteFileException();
    }

    return this.prismaService.file.delete({
      where: {
        id: fileId,
      },
    });
  }

  getUploadFilePath(fileDto: {
    fileName: string;
    fileDestination: string;
  }): string {
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

  private async uploadFile(
    fileDto: { fileName: string; fileDestination: string },
    fileBuffer: Buffer,
  ): Promise<void> {
    try {
      const uploadFilePath = this.getUploadFilePath(fileDto);
      await ensureFile(uploadFilePath);
      await writeFile(uploadFilePath, fileBuffer);
    } catch (e) {
      throw new UploadFileException({ cause: e });
    }
  }

  findFile(fileId: number): Promise<File | null> {
    return this.prismaService.file.findFirst({
      where: {
        id: fileId,
      },
    });
  }

  private findDuplicateFile(fileDto: {
    fileName: string;
    fileDestination: string;
  }): Promise<File | null> {
    return this.prismaService.file.findFirst({
      where: {
        fileName: fileDto.fileName,
        fileDestination: fileDto.fileDestination,
      },
    });
  }

  private async willOverrideFile(
    fileToUpdate: File,
    fileUpdateDto: FileUpdateDto,
  ): Promise<boolean> {
    const fileName = fileUpdateDto.fileName ?? fileToUpdate.fileName;
    const fileDestination =
      fileUpdateDto.fileDestination ?? fileToUpdate.fileDestination;

    if (!fileName || !fileDestination) {
      return false;
    }

    const fileToOverride = await this.prismaService.file.findFirst({
      where: {
        fileName,
        fileDestination,
        id: { not: fileToUpdate.id },
      },
    });

    return !!fileToOverride;
  }
}
