import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ExcelModule } from '../excel/excel.module';
import { FileModule } from '../file/file.module';
import { TaxReportModule } from '../tax-report/tax-report.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TaxReportModule,
    FileModule,
    ExcelModule,
    AuthModule,
    UserModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
