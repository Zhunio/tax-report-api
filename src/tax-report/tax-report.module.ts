import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { ExcelModule } from '../excel/excel.module';
import { FileModule } from '../file/file.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TaxReportController } from '../tax-report/tax-report.controller';
import { TaxReportService } from '../tax-report/tax-report.service';

@Module({
  imports: [PrismaModule, FileModule, ExcelModule, EmailModule, ConfigModule],
  controllers: [TaxReportController],
  providers: [TaxReportService],
})
export class TaxReportModule {}
