import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TaxReportController } from './tax-report.controller';
import { TaxReportService } from './tax-report.service';

@Module({
  imports: [PrismaModule],
  controllers: [TaxReportController],
  providers: [TaxReportService],
})
export class TaxReportModule {}
