import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData() {
    return {
      data: { getSLI: 100 - Math.random() * 10 },
    };
  }
}
