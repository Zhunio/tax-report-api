import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthReq } from './auth-test.utils';
import { AuthExceptionMessage, UnauthorizedException } from './auth.exception';
import { AuthModule } from './auth.module';
import { GreeterReq } from './greeter-test.utils';

describe('AuthGuard', () => {
  let app: INestApplication;
  let authReq: AuthReq;
  let greeterReq: GreeterReq;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = module.get(PrismaService);

    authReq = new AuthReq(app);
    greeterReq = new GreeterReq(app);

    await app.init();
    await prismaService.cleanDatabase();
  });

  describe('when making request to protected route', () => {
    it('should throw UnauthorizedException if authorization header is not present', async () => {
      const { message } = await greeterReq.safeGreet<UnauthorizedException>();

      expect(message).toEqual(AuthExceptionMessage.Unauthorized);
    });

    it('should throw UnauthorizedException if the type of the authorization header is not Bearer', async () => {
      const { message } = await greeterReq.safeGreet<UnauthorizedException>({
        headerKey: 'Authorization',
        headerValue: 'Auth ',
      });

      expect(message).toEqual(AuthExceptionMessage.Unauthorized);
    });
    it('should throw UnauthorizedException if the token cannot be decoded', async () => {
      const { message } = await greeterReq.safeGreet<UnauthorizedException>({
        headerKey: 'Authorization',
        headerValue: '',
      });

      expect(message).toEqual(AuthExceptionMessage.Unauthorized);
    });

    it('should activate route', async () => {
      const { access_token } = await authReq.register({ username: 'john', password: '12345' });
      const user = await greeterReq.safeGreet({
        headerKey: 'authorization',
        headerValue: 'Bearer ' + access_token,
      });

      expect(user).toEqual({ iat: expect.any(Number), id: expect.any(Number), username: 'john' });
    });
  });

  describe('when making request to public route', () => {
    it('should allow api call', async () => {
      const { greet } = await greeterReq.greet();

      expect(greet).toEqual('Greet');
    });
  });
});
