import { HttpException, HttpStatus } from '@nestjs/common';

export enum UserExceptionMessage {
  DuplicateTaxReport = 'User already exists',
}

export class DuplicateUserException extends HttpException {
  constructor() {
    super(
      UserExceptionMessage.DuplicateTaxReport,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
