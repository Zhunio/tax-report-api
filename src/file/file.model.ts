import { Prisma } from '@prisma/client';

export interface FileUpdateDto extends Prisma.FileUpdateInput {
  fileName?: string;
  fileDestination?: string;
}

export interface FileError {
  message: string;
}
