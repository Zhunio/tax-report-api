import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [EnvService],
  providers: [EnvService],
})
export class EnvModule {}
