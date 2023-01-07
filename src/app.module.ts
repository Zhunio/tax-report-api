import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaxReportController } from './tax-report/tax-report.controller';
import { TaxReportService } from './tax-report/tax-report.service';

@Module({
  imports: [],
  controllers: [AppController, TaxReportController],
  providers: [AppService, PrismaService, TaxReportService],
})
export class AppModule {}
