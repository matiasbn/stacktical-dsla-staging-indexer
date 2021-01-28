import { fromAscii, toChecksumAddress } from 'web3-utils';
import * as crypto from 'crypto';
import {
  GetSLIParams,
  SLAData,
  ValidatorData,
  WeekAnalyticsData,
} from './adapter.types';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import * as bs58 from 'bs58';
import { SLAABI } from '../../assets/SLAABI';
import { SLARegistryABI } from '../../assets/SLARegistryABI';

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
  private readonly ipfsClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: Logger
  ) {
    this.logger = new Logger(AdapterHelpers.name);
    this.ipfsClient = createClient({
      url: this.configService.get<string>('IPFS_URI'),
    });
  }

  createRandomAddress() {
    return toChecksumAddress('0x' + crypto.randomBytes(20).toString('hex'));
  }

  async storeDataOnIFPS(ipfsData): Promise<string> {
    const dataString = JSON.stringify(ipfsData);
    const buffer = Buffer.from(dataString, 'utf-8');
    const { path: ipfsHash } = await this.ipfsClient.add(buffer);
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

  createWeekAnalyticsData(network: string): WeekAnalyticsData {
    const { validators } = networks[network];
    return validators.reduce(
      (result, validatorName) => ({
        ...result,
        [validatorName]: { ...this.createValidatorData() },
      }),
      {}
    );
  }

  ipfsHashToBytes32(ipfsHash: string) {
    return bs58.decode(ipfsHash).slice(2).toString('hex');
  }

  bytes32ToIPFSCID(bytes32: string) {
    return bs58.encode(Buffer.from(`1220${bytes32.replace('0x', '')}`, 'hex'));
  }

  async getIPFSDataFromCID(cid: string) {
    const { data } = await this.httpService
      .get(this.configService.get<string>('IPFS_URI') + '/ipfs/' + cid)
      .toPromise();
    return data;
  }

  async getAnalyticsFromSLARegistry(
    params: GetSLIParams,
    networkName: string
  ): Promise<WeekAnalyticsData> {
    const web3 = new Web3(this.configService.get<string>('WEB3_URI'));
    const slaRegistryContract = new web3.eth.Contract(
      SLARegistryABI,
      params.sla_registry_address
    );
    const ipfsBytes32 = await slaRegistryContract.methods
      .canonicalPeriodsAnalytics(fromAscii(networkName), params.week_id)
      .call();
    const ipfsCID = this.bytes32ToIPFSCID(ipfsBytes32);
    this.logger.debug(
      'Analytics IPFS url: ' +
        this.configService.get<string>('IPFS_URI') +
        '/ipfs/' +
        ipfsCID
    );
    const data = this.getIPFSDataFromCID(ipfsCID);
    return data;
  }

  async getSLAData(address: string): Promise<SLAData> {
    const web3 = new Web3(this.configService.get<string>('WEB3_URI'));
    const slaContract = new web3.eth.Contract(SLAABI, address);
    const ipfsCID = await slaContract.methods.ipfsHash().call();
    this.logger.debug(
      'SLA IPFS url: ' +
        this.configService.get<string>('IPFS_URI') +
        '/ipfs/' +
        ipfsCID
    );
    const data = await this.getIPFSDataFromCID(ipfsCID);
    return data;
  }
}
