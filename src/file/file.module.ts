import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [EnvModule, PrismaModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
