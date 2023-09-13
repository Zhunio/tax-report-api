import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserExceptionMessage } from './user.exception';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    service = module.get(UserService);
    prisma = module.get(PrismaService);

    await prisma.cleanDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser()', () => {
    it('should create user', async () => {
      const user = await service.createUser({ username: 'john', password: 'abcde' });

      expect(user).toEqual({ id: expect.any(Number), username: 'john' });
    });

    it('should throw an error when trying to create duplicate user', async () => {
      try {
        await service.createUser({ username: 'john', password: 'abcde' });
      } catch (error) {
        expect(error.message).toEqual(UserExceptionMessage.DuplicateTaxReport);
      }
    });
  });

  describe('findUserById()', () => {
    it('should find user by id', async () => {
      const { id } = await service.createUser({ username: 'mateo', password: 'abcde' });
      const user = await service.findUserById(id);

      expect(user).toEqual({ id, username: 'mateo' });
    });
  });
});
