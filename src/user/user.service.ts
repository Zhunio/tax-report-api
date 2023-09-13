import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { DuplicateUserException } from './user.exception';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(userDto: {
    username: string;
    password: string;
  }): Promise<User> {
    const isDuplicateUser = await this.prismaService.user.findFirst({
      where: userDto,
    });
    if (isDuplicateUser) {
      throw new DuplicateUserException();
    }

    const { password, ...userFields } = await this.prismaService.user.create({
      data: userDto,
    });

    return userFields;
  }

  async findUserById(userId: number): Promise<User> {
    const { password, ...userFields } = await this.prismaService.user.findFirst(
      {
        where: { id: userId },
      },
    );

    return userFields;
  }
}
