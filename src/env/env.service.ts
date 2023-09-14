import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from '../config/environment.config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvironmentVariable>) {}

  get databaseUrl(): EnvironmentVariable['TAX_REPORT_DATABASE_URL'] {
    return this.configService.get('TAX_REPORT_DATABASE_URL');
  }

  get mediaPath(): EnvironmentVariable['TAX_REPORT_MEDIA_PATH'] {
    return this.configService.get('TAX_REPORT_MEDIA_PATH');
  }

  get jwtSecret(): EnvironmentVariable['TAX_REPORT_JWT_SECRET'] {
    return this.configService.get('TAX_REPORT_JWT_SECRET');
  }
}
