import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { TaxReportModule } from '../tax-report/tax-report.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TaxReportModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
