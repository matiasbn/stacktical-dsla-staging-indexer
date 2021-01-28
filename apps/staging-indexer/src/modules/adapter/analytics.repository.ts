import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetAnalyticsParams, WeekAnalyticsData } from './adapter.types';
import { Analytics } from './analytics.schema';

@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectModel(Analytics.name)
    private readonly weekAnalyticsModel: Model<Analytics>
  ) {}

  findExistingAnalyticsData(params: GetAnalyticsParams): Promise<Analytics> {
    return this.weekAnalyticsModel
      .findOne({
        network_name: params.network_name,
        sla_monitoring_start: params.sla_monitoring_start,
        sla_monitoring_end: params.sla_monitoring_end,
        week_id: params.week_id,
      })
      .exec();
  }

  storeNewAnalyticsData(
    params: GetAnalyticsParams,
    ipfsHash: string,
    week_analytics: WeekAnalyticsData
  ): Promise<Analytics> {
    return this.weekAnalyticsModel.create({
      network_name: params.network_name,
      sla_monitoring_start: params.sla_monitoring_start,
      sla_monitoring_end: params.sla_monitoring_end,
      week_id: params.week_id,
      ipfsHash,
      week_analytics,
    });
  }
}
