import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserExceptionMessage } from '../user/user.exception';
import { UserError } from '../user/user.model';
import { AuthReq } from './auth-test.utils';
import { AuthModule } from './auth.module';

describe('AuthController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let authReq: AuthReq;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);

    authReq = new AuthReq(app);

    await app.init();
    await prismaService.cleanDatabase();
  });

  describe('register()', () => {
    it('should register user', async () => {
      const { access_token } = await authReq.register({ username: 'john', password: 'abcde' });

      const user = jwtService.decode(access_token);

      expect(user).toEqual({ iat: expect.any(Number), id: expect.any(Number), username: 'john' });
    });

    it('should throw an error when trying to register duplicate user', async () => {
      await authReq.register({ username: 'matt', password: 'abcde' });
      const { message } = await authReq.register<UserError>({
        username: 'matt',
        password: 'abcde',
      });

      expect(message).toEqual(UserExceptionMessage.DuplicateUser);
    });
  });

  describe('login()', () => {
    it('should login user', async () => {
      await authReq.register({ username: 'mateo', password: 'abcde' });
      const { access_token } = await authReq.login({ username: 'mateo', password: 'abcde' });

      const user = jwtService.decode(access_token);

      expect(user).toEqual({ iat: expect.any(Number), id: expect.any(Number), username: 'mateo' });
    });

    it('should throw an error when trying to login when user that does not exist', async () => {
      const { message } = await authReq.login<UserError>({ username: 'jona', password: 'abcde' });

      expect(message).toEqual(UserExceptionMessage.UserNotFound);
    });
  });
});
