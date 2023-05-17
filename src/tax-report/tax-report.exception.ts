import { HttpException, HttpStatus } from '@nestjs/common';

export enum TaxReportExceptionMessage {
  DuplicateTaxReport = 'Tax Report already exists',
  CouldNotDeleteTaxReportException = 'Could not delete tax report',
}

export class DuplicateTaxReportException extends HttpException {
  constructor() {
    super(
      TaxReportExceptionMessage.DuplicateTaxReport,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class CouldNotDeleteTaxReportException extends HttpException {
  constructor() {
    super(
      TaxReportExceptionMessage.CouldNotDeleteTaxReportException,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
