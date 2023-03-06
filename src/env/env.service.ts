import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from '../config/environment.config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvironmentVariable>) {}

  get databaseUrl(): EnvironmentVariable['TRA_DATABASE_URL'] {
    return this.configService.get('TRA_DATABASE_URL');
  }

  get mediaPath(): EnvironmentVariable['TRA_MEDIA_PATH'] {
    return this.configService.get('TRA_MEDIA_PATH');
  }
}
