import { ExcelModule } from '@/excel/excel.module';
import { TaxReportModule } from '@/tax-report/tax-report.module';
import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [TaxReportModule, FileModule, ExcelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
