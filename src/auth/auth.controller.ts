import { UserDto } from '@/user/user.model';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@/user/user.module';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @Post('login')
  login(@Body() userDto: UserDto) {
    return this.authService.login(userDto);
  }
}
