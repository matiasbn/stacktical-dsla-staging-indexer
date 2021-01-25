import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SLI } from './sli.schema';
import { GetSLIParams, ValidatorDataWithIPFSHash } from '../api.types';
import { toChecksumAddress } from 'web3-utils';

@Injectable()
export class SLIRepository {
  constructor(@InjectModel(SLI.name) private readonly sliModel: Model<SLI>) {}

  findExistingSLI(params: GetSLIParams): Promise<SLI> {
    return this.sliModel
      .findOne({
        slaAddress: toChecksumAddress(params.sla_address),
        slaMonitoringStart: params.sla_monitoring_start,
        slaMonitoringEnd: params.sla_monitoring_end,
      })
      .exec();
  }

  storeNewSLI(
    params: GetSLIParams,
    ipfsData: ValidatorDataWithIPFSHash
  ): Promise<SLI> {
    return this.sliModel.create({
      slaAddress: toChecksumAddress(params.sla_address),
      slaMonitoringStart: params.sla_monitoring_start,
      slaMonitoringEnd: params.sla_monitoring_end,
      hits: ipfsData.hits,
      misses: ipfsData.misses,
      total: ipfsData.total,
      efficiency: ipfsData.staking_efficiency_percent,
      totalStake: ipfsData.total_stake,
      delegators: ipfsData.delegators,
      ipfsHash: ipfsData.ipfsHash,
    });
  }
}
