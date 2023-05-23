import { TaxReportService } from '@/tax-report/service/tax-report.service';
import { TaxReportCreate } from '@/tax-report/types/tax-report.model';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TaxReport } from '@prisma/client';

@Controller('tax-report')
export class TaxReportController {
  constructor(private readonly taxReportService: TaxReportService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createTaxReport(
    @Body() taxReportCreate: TaxReportCreate,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.taxReportService.createTaxReport(taxReportCreate, file.buffer);
  }

  @Delete(':taxReportId')
  async deleteTaxReport(
    @Param('taxReportId') taxReportId: string,
  ): Promise<TaxReport> {
    return this.taxReportService.deleteTaxReport(parseInt(taxReportId, 10));
  }
}
