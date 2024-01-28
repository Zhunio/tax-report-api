import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserExceptionMessage } from './user.exception';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    userService = module.get(UserService);
    prismaService = module.get(PrismaService);

    await prismaService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser()', () => {
    it('should create user', async () => {
      const user = await userService.createUser({ username: 'john', password: 'abcde' });

      expect(user).toEqual({ id: expect.any(Number), username: 'john' });
    });

    it('should throw an error when trying to create duplicate user', async () => {
      try {
        await userService.createUser({ username: 'john', password: 'abcde' });
      } catch (error) {
        expect(error.message).toEqual(UserExceptionMessage.DuplicateUser);
      }
    });
  });

  describe('findUserByUsernameAndPassword()', () => {
    it('should find user by username and password', async () => {
      await userService.createUser({ username: 'mateo', password: 'abcde' });
      const user = await userService.findUserByUsernameAndPassword({
        username: 'mateo',
        password: 'abcde',
      });

      expect(user).toEqual({ id: expect.any(Number), username: 'mateo' });
    });
  });
});
