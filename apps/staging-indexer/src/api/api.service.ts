import { Injectable } from '@nestjs/common';
import { APIQuery } from './types';
import { SLIRepository } from './sli.repository';

@Injectable()
export class ApiService {
  constructor(private readonly sliRepository: SLIRepository) {}

  async getSLI(params: APIQuery) {
    const existingSLI = await this.sliRepository.findExistingSLI(params);
    if (existingSLI) {
      const { hits, misses, validations } = existingSLI;
      return {
        data: {
          validations,
          hits,
          misses,
          getSLI: hits / validations,
        },
      };
    }
    const efficiency = 100 - Math.random() * 10;
    const validations = Math.floor(10000 * Math.random());
    const hits = Math.floor((validations * efficiency) / 100);
    const misses = validations - hits;
    await this.sliRepository.storeNewSLI(params, hits, misses, validations);
    return {
      data: { validations, hits, misses, getSLI: efficiency },
    };
  }
}
