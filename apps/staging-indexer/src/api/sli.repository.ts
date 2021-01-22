import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SLI } from './sli.schema';
import { APIQuery } from './types';
import { toChecksumAddress } from 'web3-utils';

@Injectable()
export class SLIRepository {
  constructor(@InjectModel(SLI.name) private readonly sliModel: Model<SLI>) {}

  findExistingSLI(params: APIQuery): Promise<SLI> {
    return this.sliModel
      .findOne({
        slaAddress: toChecksumAddress(params.sla_address),
        slaMonitoringStart: params.sla_monitoring_start,
        slaMonitoringEnd: params.sla_monitoring_end,
      })
      .exec();
  }

  storeNewSLI(
    params: APIQuery,
    hits: number,
    misses: number,
    total: number,
    efficiency: number,
    totalStake: number,
    delegators: Array<string>
  ): Promise<SLI> {
    return this.sliModel.create({
      slaAddress: toChecksumAddress(params.sla_address),
      slaMonitoringStart: params.sla_monitoring_start,
      slaMonitoringEnd: params.sla_monitoring_end,
      hits,
      misses,
      total,
      efficiency,
      totalStake,
      delegators,
      ipfsHash: ' ',
    });
  }

  updateIpfsHash(sli: SLI, ipfsHash: string): Promise<SLI> {
    return this.sliModel
      .findByIdAndUpdate(sli._id, { $set: { ipfsHash } }, { new: true })
      .exec();
  }
}
