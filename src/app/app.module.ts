import { AuthModule } from '@/auth/auth.module';
import { ExcelModule } from '@/excel/excel.module';
import { TaxReportModule } from '@/tax-report/tax-report.module';
import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TaxReportModule, FileModule, ExcelModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
