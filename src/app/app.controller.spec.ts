import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { APP_VERSION } from './version';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get(AppController);
  });

  describe('getVersion()', () => {
    it('should return "Welcome to Budget API vx.x.x"', () => {
      expect(appController.getVersion()).toBe(`Welcome to Budget API v${APP_VERSION}`);
    });
  });
});