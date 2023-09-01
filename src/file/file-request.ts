import { FileError } from '@/file/models/file.model';
import { INestApplication } from '@nestjs/common';
import { File } from '@prisma/client';
import * as request from 'supertest';

export class FileRequest {
  private req: request.SuperTest<request.Test>;

  constructor(app: INestApplication) {
    this.req = request(app.getHttpServer());
  }

  async getFileById<T extends File | FileError = File>(fileId: number) {
    const { body } = await this.req.get('/file/' + fileId);
    return body as T;
  }
}