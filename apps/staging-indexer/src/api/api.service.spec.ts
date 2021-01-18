import { Test } from '@nestjs/testing';

import { ApiService } from './api.service';

describe('AppService', () => {
  let service: ApiService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [ApiService],
    }).compile();

    service = app.get<ApiService>(ApiService);
  });

  describe('getData', () => {
    it('should return "Welcome to staging-api!"', () => {
      expect(service.getData()).toEqual({
        message: 'Welcome to staging-api!',
      });
    });
  });
});
