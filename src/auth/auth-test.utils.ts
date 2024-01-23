import { UserDto, UserError } from '../user/user.model';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export class AuthReq {
  private req: request.SuperTest<request.Test>;

  constructor(app: INestApplication) {
    this.req = request(app.getHttpServer());
  }

  async register<
    T extends { access_token: string } | UserError = { access_token: string },
  >(userDto: UserDto) {
    const { body } = await this.req.post('/auth/register').send(userDto);

    return body as T;
  }

  async login<
    T extends { access_token: string } | UserError = { access_token: string },
  >(userDto: UserDto) {
    const { body } = await this.req.post('/auth/login').send(userDto);

    return body as T;
  }
}
