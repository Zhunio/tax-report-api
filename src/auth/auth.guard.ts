import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from './auth.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenOrThrow(request);
    const payload = await this.decodePayloadOrThrow(token);

    request['user'] = payload;

    return true;
  }

  private extractTokenOrThrow(request: any) {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];

    if (type === 'Bearer') {
      return token;
    } else {
      throw new UnauthorizedException();
    }
  }

  private async decodePayloadOrThrow(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return payload;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
