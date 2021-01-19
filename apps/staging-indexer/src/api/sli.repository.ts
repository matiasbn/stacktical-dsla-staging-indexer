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
    validations: number,
    efficiency: number
  ): Promise<SLI> {
    return this.sliModel.create({
      slaAddress: toChecksumAddress(params.sla_address),
      slaMonitoringStart: params.sla_monitoring_start,
      slaMonitoringEnd: params.sla_monitoring_end,
      hits,
      misses,
      validations,
      efficiency,
    });
  }
}
