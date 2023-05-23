import { ExcelService } from '@/excel/excel.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
