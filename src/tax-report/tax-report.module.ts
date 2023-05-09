import { FileModule } from '@/file/file.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { TaxReportController } from '@/tax-report/controller/tax-report.controller';
import { TaxReportService } from '@/tax-report/service/tax-report.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, FileModule],
  controllers: [TaxReportController],
  providers: [TaxReportService],
})
export class TaxReportModule {}
