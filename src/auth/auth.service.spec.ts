import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { UserExceptionMessage } from '@/user/user.exception';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, PrismaModule],
    }).compile();

    service = module.get(AuthService);
    userService = module.get(UserService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);

    await prismaService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register()', () => {
    it('should register user', async () => {
      const { access_token } = await service.register({ username: 'john', password: 'abcde' });

      const user = jwtService.decode(access_token);

      expect(user).toEqual({ iat: expect.any(Number), id: expect.any(Number), username: 'john' });
    });

    it('should throw an error when trying to register duplicate user', async () => {
      let error: { message: string } | undefined;

      try {
        await service.register({ username: 'matt', password: 'abcde' });
        await service.register({ username: 'matt', password: 'abcde' });
      } catch (e) {
        error = e;
      }

      expect(error.message).toEqual(UserExceptionMessage.DuplicateUser);
    });
  });

  describe('login()', () => {
    it('should login user', async () => {
      await service.register({ username: 'mateo', password: 'abcde' });
      const user = await service.login({ username: 'mateo', password: 'abcde' });

      expect(user).toEqual({ id: expect.any(Number), username: 'mateo' });
    });

    it('should throw an error when trying to login when user that does not exist', async () => {
      let error: { message: string } | undefined;
      try {
        await service.login({ username: 'jona', password: 'abcde' });
      } catch (e) {
        error = e;
      }

      expect(error?.message).toEqual(UserExceptionMessage.UserNotFound);
    });
  });
});
