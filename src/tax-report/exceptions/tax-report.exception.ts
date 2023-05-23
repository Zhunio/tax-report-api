import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateTaxReportException extends HttpException {
  constructor() {
    super('Tax Report already exists', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
