import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

export class DuplicateFileException extends HttpException {
  constructor() {
    super('File already exists', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class UploadFileException extends HttpException {
  constructor(options?: HttpExceptionOptions) {
    super('Upload file exception', HttpStatus.INTERNAL_SERVER_ERROR, options);
  }
}
