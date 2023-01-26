import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaxReportModule } from './tax-report/tax-report.module';

@Module({
  imports: [TaxReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
