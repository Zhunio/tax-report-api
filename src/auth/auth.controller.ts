import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from '../user/user.model';
import { Public } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @Public()
  @Post('login')
  login(@Body() userDto: UserDto) {
    return this.authService.login(userDto);
  }
}
