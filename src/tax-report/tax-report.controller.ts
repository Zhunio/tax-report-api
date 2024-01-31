import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TaxReport } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { PaymentUpdateDto, TaxReportCreateDto } from './tax-report.model';
import { TaxReportService } from './tax-report.service';

@Controller('tax-report')
@UseGuards(AuthGuard)
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

  @Patch(':taxReportId/payment/:paymentId')
  async updateTaxReportPayment(
    @Param('taxReportId') taxReportId: string,
    @Param('paymentId') paymentId: string,
    @Body() paymentUpdate: PaymentUpdateDto,
  ): Promise<TaxReport> {
    return this.taxReportService.editTaxReportPayment(
      parseInt(taxReportId, 10),
      parseInt(paymentId, 10),
      paymentUpdate,
    );
  }

  @Delete(':taxReportId')
  async deleteTaxReport(
    @Param('taxReportId') taxReportId: string,
  ): Promise<TaxReport> {
    return this.taxReportService.deleteTaxReport(parseInt(taxReportId, 10));
  }

  @Post('email/:taxReportId')
  sendEmail(@Param('taxReportId') taxReportId: string) {
    return this.taxReportService.sendEmail(parseInt(taxReportId));
  }
}
