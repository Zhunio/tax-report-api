import { AppModule } from '@/app/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { UserExceptionMessage } from '@/user/user.exception';
import { UserError } from '@/user/user.model';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthReq } from './auth-test.utils';

describe('AuthController (e2e)', () => {
  let req: AuthReq;
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = app.get(PrismaService);
    jwtService = app.get(JwtService);

    req = new AuthReq(app);

    await app.init();
    await prismaService.cleanDatabase();
  });

  describe('register()', () => {
    it('should register user', async () => {
      const { access_token } = await req.register({ username: 'john', password: 'abcde' });

      const user = jwtService.decode(access_token);

      expect(user).toEqual({ iat: expect.any(Number), id: expect.any(Number), username: 'john' });
    });

    it('should throw an error when trying to register duplicate user', async () => {
      await req.register({ username: 'matt', password: 'abcde' });
      const { message } = await req.register<UserError>({ username: 'matt', password: 'abcde' });

      expect(message).toEqual(UserExceptionMessage.DuplicateUser);
    });
  });

  describe('login()', () => {
    it('should login user', async () => {
      await req.register({ username: 'mateo', password: 'abcde' });
      const { access_token } = await req.login({ username: 'mateo', password: 'abcde' });

      const user = jwtService.decode(access_token);

      expect(user).toEqual({ iat: expect.any(Number), id: expect.any(Number), username: 'mateo' });
    });

    it('should throw an error when trying to login when user that does not exist', async () => {
      const { message } = await req.login<UserError>({ username: 'jona', password: 'abcde' });

      expect(message).toEqual(UserExceptionMessage.UserNotFound);
    });
  });
});
