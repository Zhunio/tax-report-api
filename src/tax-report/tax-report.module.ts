import { ExcelModule } from '@/excel/excel.module';
import { FileModule } from '@/file/file.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { TaxReportController } from '@/tax-report/tax-report.controller';
import { TaxReportService } from '@/tax-report/tax-report.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, FileModule, ExcelModule],
  controllers: [TaxReportController],
  providers: [TaxReportService],
})
export class TaxReportModule {}
