import { Controller, Get } from '@nestjs/common';
import { APP_VERSION } from './version';

@Controller()
export class AppController {
  @Get()
  getVersion(): string {
    return `Welcome to Budget API v${APP_VERSION}`;
  }
}