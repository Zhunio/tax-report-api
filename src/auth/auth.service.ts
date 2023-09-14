import { UserNotFoundException } from '@/user/user.exception';
import { UserDto } from '@/user/user.model';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: UserDto): Promise<{ access_token: string }> {
    const user = await this.userService.createUser(userDto);

    const payload = { ...user };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  async login(userDto: UserDto): Promise<{ access_token: string }> {
    const user = await this.userService.findUserByUsernameAndPassword(userDto);

    if (!user) {
      throw new UserNotFoundException();
    }

    const payload = { ...user };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
