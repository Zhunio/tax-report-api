import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { DuplicateUserException } from './user.exception';
import { User, UserDto } from './user.model';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(userDto: UserDto): Promise<User> {
    const isDuplicateUser = await this.prismaService.user.findFirst({
      where: userDto,
    });
    if (isDuplicateUser) {
      throw new DuplicateUserException();
    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password, ...userFields } = await this.prismaService.user.create({
      data: userDto,
    });

    return userFields;
  }

  async findUserByUsernameAndPassword(userDto: UserDto): Promise<User> {
    const user = await this.prismaService.user.findFirst({ where: userDto });

    if (!user) {
      return null;
    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password, ...userFields } = user;

    return userFields;
  }
}
