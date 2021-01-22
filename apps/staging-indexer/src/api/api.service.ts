import { Injectable } from '@nestjs/common';
import { APIQuery, APIResponse } from './types';
import { SLIRepository } from './sli.repository';
import { SLI } from './sli.schema';
import { toChecksumAddress } from 'web3-utils';
import * as crypto from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createClient = require('ipfs-http-client');

@Injectable()
export class ApiService {
  constructor(private readonly sliRepository: SLIRepository) {}

  responseParser(sliData: SLI): APIResponse {
    const data = {
      totalStake: sliData.totalStake,
      total: sliData.total,
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
      delegators
    );
    const sliParsed = await this.responseParser(newSli);
    const { data } = sliParsed;

    const ipfsClient = createClient({
      host: 'ipfs.dsla.network',
      port: 443,
      protocol: 'https',
    });

    const dataString = JSON.stringify(data);
    const buffer = Buffer.from(dataString, 'utf-8');
    const { path } = await ipfsClient.add(buffer);
    await this.sliRepository.updateIpfsHash(newSli, path);

    return sliParsed;
  }
}
