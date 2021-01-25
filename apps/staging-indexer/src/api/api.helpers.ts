import { toChecksumAddress } from 'web3-utils';
import * as crypto from 'crypto';
import { SLI } from './domain/sli.schema';
import {
  GetAnalyticsResponse,
  GetSLIResponse,
  ValidatorData,
  ValidatorDataWithIPFSHash,
  WeekAnalyticsData,
} from './types';
import { Injectable } from '@nestjs/common';
import { WeekAnalytics } from './domain/week-analytics.schema';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createClient = require('ipfs-http-client');

const networks = {
  ONE: { validators: ['P-OPS', 'Chainode', 'Everstake'] },
  DOT: { validators: ['Everstake', 'Figment', 'stakefish'] },
  ATOM: { validators: ['Everstake', 'Figment', 'stakefish'] },
  BAND: { validators: ['Chainode'] },
};

@Injectable()
export class ApiHelpers {
  createRandomAddress() {
    return toChecksumAddress('0x' + crypto.randomBytes(20).toString('hex'));
  }

  async storeDataOnIFPS(ipfsData): Promise<string> {
    const ipfsClient = createClient({
      host: 'localhost',
      port: 5001,
      protocol: 'http',
    });

    const dataString = JSON.stringify(ipfsData);
    const buffer = Buffer.from(dataString, 'utf-8');
    const { path: ipfsHash } = await ipfsClient.add(buffer);
    return ipfsHash;
  }

  parseGetSLIResponse(sliData: SLI): GetSLIResponse {
    const data: ValidatorDataWithIPFSHash = {
      total_stake: sliData.totalStake,
      total: sliData.total,
      hits: sliData.hits,
      misses: sliData.misses,
      staking_efficiency_percent: sliData.efficiency,
      ipfsHash: sliData.ipfsHash,
      delegators: sliData.delegators,
    };
    return {
      data,
      sliData: sliData.hits + ',' + sliData.misses,
    };
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

  parseWeekAnalyticsResponse(
    weekAnalytics: WeekAnalytics
  ): GetAnalyticsResponse {
    return {
      week_id: weekAnalytics.week_id,
      week_analytics: weekAnalytics.week_analytics,
      ipfsHash: weekAnalytics.ipfsHash,
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
}
