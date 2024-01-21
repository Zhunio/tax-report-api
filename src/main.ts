import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const prismaService = app.get(PrismaService);
  const port = configService.get('PORT') || 3000;
  
  app.enableCors();
  await prismaService.enableShutdownHooks(app);
  await app.listen(port);
}

bootstrap();
