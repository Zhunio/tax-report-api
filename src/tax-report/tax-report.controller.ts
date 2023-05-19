import {
  PaymentUpdateDto,
  TaxReportCreateDto,
} from '@/tax-report/tax-report.model';
import { TaxReportService } from '@/tax-report/tax-report.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TaxReport } from '@prisma/client';

@Controller('tax-report')
export class TaxReportController {
  constructor(private readonly taxReportService: TaxReportService) {}

  @Get()
  async getAllTaxReports() {
    return this.taxReportService.getAllTaxReports();
  }

  @Get(':taxReportId')
  async getTaxReportById(
    @Param('taxReportId') taxReportId: string,
  ): Promise<TaxReport> {
    return this.taxReportService.getTaxReportById(parseInt(taxReportId, 10));
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createTaxReport(
    @Body() { fiscalQuarter, fiscalYear }: TaxReportCreateDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TaxReport> {
    return this.taxReportService.createTaxReport(
      {
        fiscalQuarter: parseInt(fiscalQuarter, 10),
        fiscalYear: parseInt(fiscalYear, 10),
      },
      file.buffer,
    );
  }

  @Patch(':taxReportId/bulk/payment')
  async bulkEditTaxReportPayments(
    @Param('taxReportId') taxReportId: string,
    @Body() paymentUpdates: PaymentUpdateDto[],
  ): Promise<TaxReport> {
    return this.taxReportService.bulkEditTaxReportPayments(
      parseInt(taxReportId, 10),
      paymentUpdates,
    );
  }

  @Delete(':taxReportId')
  async deleteTaxReport(
    @Param('taxReportId') taxReportId: string,
  ): Promise<TaxReport> {
    return this.taxReportService.deleteTaxReport(parseInt(taxReportId, 10));
  }
}
