import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { WeekAnalyticsData } from './adapter.types';
import { Analytics } from './analytics.schema';
import { GetAnalyticsData } from './adapter.dtos';
import { toAscii } from 'web3-utils';

@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectModel(Analytics.name)
    private readonly weekAnalyticsModel: Model<Analytics>
  ) {}

  findExistingAnalyticsData(params: GetAnalyticsData): Promise<Analytics> {
    return this.weekAnalyticsModel
      .findOne({
        network_name: params.network_name,
        sla_monitoring_start: params.sla_monitoring_start,
        sla_monitoring_end: params.sla_monitoring_end,
      })
      .exec();
  }

  storeNewAnalyticsData(
    params: GetAnalyticsData,
    ipfsHash: string,
    week_analytics: WeekAnalyticsData
  ): Promise<Analytics> {
    return this.weekAnalyticsModel.create({
      network_name: params.network_name,
      sla_monitoring_start: params.sla_monitoring_start,
      sla_monitoring_end: params.sla_monitoring_end,
      ipfsHash,
      week_analytics,
    });
  }
}
