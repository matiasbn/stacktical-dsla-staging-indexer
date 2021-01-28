import { toChecksumAddress, toAscii, hexToUtf8, hexToBytes } from 'web3-utils';
import * as crypto from 'crypto';
import { ValidatorData, WeekAnalyticsData } from './adapter.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bs58 from 'bs58';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createClient = require('ipfs-http-client');

export const networks = {
  ONE: { validators: ['P-OPS', 'Chainode', 'Everstake'] },
  DOT: { validators: ['Everstake', 'Figment', 'stakefish'] },
  ATOM: { validators: ['Everstake', 'Figment', 'stakefish'] },
  BAND: { validators: ['Chainode'] },
};

@Injectable()
export class AdapterHelpers {
  constructor(private readonly configService: ConfigService) {}
  createRandomAddress() {
    return toChecksumAddress('0x' + crypto.randomBytes(20).toString('hex'));
  }

  async storeDataOnIFPS(ipfsData): Promise<string> {
    const ipfsClient = createClient({
      url: this.configService.get<string>('IPFS_URI'),
    });

    const dataString = JSON.stringify(ipfsData);
    const buffer = Buffer.from(dataString, 'utf-8');
    const { path: ipfsHash } = await ipfsClient.add(buffer);
    return ipfsHash;
  }

  createValidatorData(): ValidatorData {
    const delegatorsNumber = Math.floor(10 * Math.random()) + 1;
    const delegators = [];
    for (let index = 0; index < delegatorsNumber; index++) {
      const delegator = this.createRandomAddress();
      delegators.push(delegator);
    }
    const total = Math.floor(10000 * Math.random());
    const total_stake = Math.floor(10000 * Math.random());
    const hits = Math.floor((total * (100 - Math.random() * 10)) / 100);
    const misses = total - hits;
    const staking_efficiency_percent = (hits * 100) / total;
    return {
      total_stake,
      total,
      hits,
      misses,
      staking_efficiency_percent,
      delegators,
    };
  }

  createWeekAnalyticsData(network: string, week_id: number): WeekAnalyticsData {
    const { validators } = networks[network];
    const week_analytics = validators.reduce(
      (result, validatorName) => ({
        ...result,
        [validatorName]: { ...this.createValidatorData() },
      }),
      {}
    );
    return {
      week_id,
      week_analytics,
    };
  }

  ipfsHashToBytes32(ipfsHash: string) {
    return bs58.decode(ipfsHash).slice(2).toString('hex');
  }

  bytes32ToIPFSHash(bytes32: string) {
    return bs58.encode(Buffer.from(`1220${bytes32.replace('0x', '')}`, 'hex'));
  }
}
