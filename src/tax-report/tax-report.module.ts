import { Module } from '@nestjs/common';
import { ExcelModule } from '../excel/excel.module';
import { FileModule } from '../file/file.module';
import { TaxReportController } from '../tax-report/tax-report.controller';
import { TaxReportService } from '../tax-report/tax-report.service';

@Module({
  imports: [FileModule, ExcelModule],
  controllers: [TaxReportController],
  providers: [TaxReportService],
})
export class TaxReportModule {}
