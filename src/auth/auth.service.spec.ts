import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, PrismaModule],
    }).compile();

    service = module.get(AuthService);
    userService = module.get(UserService);
    prismaService = module.get(PrismaService);

    await prismaService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register()', () => {
    it('should register user', async () => {
      const user = await service.register({ username: 'john', password: 'abcde' });

      expect(user).toEqual({ id: expect.any(Number), username: 'john' });
    });

    it.todo('should throw an error when trying to register duplicate user');
  });

  describe('login()', () => {
    it('should login user', async () => {
      const user = await service.login({ username: 'john', password: 'abcde' });

      expect(user).toEqual({ id: expect.any(Number), username: 'john' });
    });

    it.todo('should throw an error when trying to login when user that does not exist');
  });

  it.todo('should logout user');
});
