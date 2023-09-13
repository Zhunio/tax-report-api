import { User, UserDto } from '@/user/user.model';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(userDto: UserDto): Promise<User> {
    const user = await this.userService.createUser(userDto);

    return user;
  }

  async login(userDto: UserDto): Promise<User> {
    const user = await this.userService.findUserByUsernameAndPassword(userDto);

    return user;
  }
}
