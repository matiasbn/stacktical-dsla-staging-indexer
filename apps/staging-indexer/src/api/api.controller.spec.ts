import { Test, TestingModule } from '@nestjs/testing';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [ApiService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to staging-api!"', () => {
      const appController = app.get<ApiController>(ApiController);
      expect(appController.getData()).toEqual({
        message: 'Welcome to staging-api!',
      });
    });
  });
});
