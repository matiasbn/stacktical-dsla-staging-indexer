import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData() {
    const efficiency = 100 - Math.random() * 10;
    const validations = Math.floor(10000 * Math.random());
    const hits = Math.floor((validations * efficiency) / 100);
    const misses = validations - hits;
    console.log(hits);
    console.log(misses);
    return {
      data: { validations, hits, misses },
    };
  }
}
