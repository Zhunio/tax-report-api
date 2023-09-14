import { HttpException, HttpStatus } from '@nestjs/common';

export enum UserExceptionMessage {
  DuplicateUser = 'User already exists',
  UserNotFound = 'User could not be found',
}

export class DuplicateUserException extends HttpException {
  constructor() {
    super(UserExceptionMessage.DuplicateUser, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super(UserExceptionMessage.UserNotFound, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
