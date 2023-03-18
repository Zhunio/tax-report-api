import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus
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

export class DeleteFileException extends HttpException {
  constructor() {
    super('File does not exists', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class EditFileThatDoesNotExistException extends HttpException {
  constructor() {
    super(
      'Trying to edit file that does not exist',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class OverrideFileException extends HttpException {
  constructor() {
    super(
      'Trying to edit file that is trying to replace another file',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
