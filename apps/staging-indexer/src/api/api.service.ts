import { Injectable } from '@nestjs/common';
import { APIQuery, APIResponse } from './types';
import { SLIRepository } from './sli.repository';
import { SLI } from './sli.schema';
import { toChecksumAddress } from 'web3-utils';
import * as crypto from 'crypto';

@Injectable()
export class ApiService {
  constructor(private readonly sliRepository: SLIRepository) {}

  responseParser(sliData: SLI): APIResponse {
    const data = {
      getSLI: sliData.efficiency,
      total: sliData.total,
      totalStake: sliData.totalStake,
      hits: sliData.hits,
      misses: sliData.misses,
      efficiency: sliData.efficiency,
      delegators: sliData.delegators,
    };
    return {
      data,
      sliData: sliData.hits + ',' + sliData.misses,
    };
  }

  async getSLI(params: APIQuery): Promise<APIResponse> {
    const existingSLI = await this.sliRepository.findExistingSLI(params);
    if (existingSLI) {
      return this.responseParser(existingSLI);
    }
    const delegatorsNumber = Math.floor(10 * Math.random()) + 1;
    const delegators = [];
    for (let index = 0; index < delegatorsNumber; index++) {
      const delegator = toChecksumAddress(
        '0x' + crypto.randomBytes(20).toString('hex')
      );
      delegators.push(delegator);
    }
    const total = Math.floor(10000 * Math.random());
    const totalStake = Math.floor(10000 * Math.random());
    const hits = Math.floor((total * (100 - Math.random() * 10)) / 100);
    const misses = total - hits;
    const efficiency = Math.trunc((hits / total) * 100 * 1000);
    const newSli = await this.sliRepository.storeNewSLI(
      params,
      hits,
      misses,
      total,
      efficiency,
      totalStake,
      delegators,
      efficiency
    );
    return this.responseParser(newSli);
  }
}
