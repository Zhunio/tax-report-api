import {
  Controller,
  Get,
  INestApplication,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import request from 'supertest';
import { User } from '../user/user.model';
import { AuthGuard } from './auth.guard';

@Controller('greeter')
export class GreeterController {
  @Get('greet')
  greet(): { greet: 'Greet' } {
    return { greet: 'Greet' };
  }

  @UseGuards(AuthGuard)
  @Get('safe-greet')
  safeGreet(@Request() req) {
    return req.user;
  }
}

export class GreeterReq {
  private req: request.SuperTest<request.Test>;

  constructor(app: INestApplication) {
    this.req = request(app.getHttpServer());
  }

  async greet<T extends { greet: 'Greet' }>() {
    const { body } = await this.req.get('/greeter/greet');

    return body as T;
  }

  async safeGreet<
    T extends (User & { iat: number }) | UnauthorizedException = User & {
      iat: number;
    },
  >(header?: { headerKey: string; headerValue: string }) {
    if (header) {
      const { body } = await this.req
        .get('/greeter/safe-greet')
        .set(header.headerKey, header.headerValue);

      return body as T;
    } else {
      const { body } = await this.req.get('/greeter/safe-greet');

      return body as T;
    }
  }
}
