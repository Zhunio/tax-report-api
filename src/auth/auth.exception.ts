import { HttpException, HttpStatus } from '@nestjs/common';

export enum AuthExceptionMessage {
  Unauthorized = 'Unauthorized',
}

export class UnauthorizedException extends HttpException {
  constructor() {
    super(AuthExceptionMessage.Unauthorized, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
