import {
  INestApplication,
  Injectable,
  OnModuleInit
} from '@nestjs/common';
import { PrismaClient, PrismaPromise } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async cleanDatabase() {
    const transactions: PrismaPromise<any>[] = [];
    transactions.push(this.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

    const tablenames = await this.$queryRaw<
      Array<{ TABLE_NAME: string }>
    >`SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = 'tax-report';`;

    for (const { TABLE_NAME } of tablenames) {
      if (TABLE_NAME !== '_prisma_migrations') {
        try {
          transactions.push(this.$executeRawUnsafe(`TRUNCATE ${TABLE_NAME};`));
        } catch (error) {
          console.log({ error });
        }
      }
    }

    transactions.push(this.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`);

    try {
      await this.$transaction(transactions);
    } catch (error) {
      console.log({ error });
    }
  }
}
