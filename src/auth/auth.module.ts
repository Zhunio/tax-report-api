import { EnvModule } from '@/env/env.module';
import { EnvService } from '@/env/env.service';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GreeterController } from './greeter-test.utils';

@Module({
  imports: [
    EnvModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (envService: EnvService) => ({
        secret: envService.jwtSecret,
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController, GreeterController],
})
export class AuthModule {}
