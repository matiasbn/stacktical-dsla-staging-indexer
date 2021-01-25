import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { WeekAnalyticsData } from '../api.types';
import { WeekAnalytics } from './week-analytics.schema';
import { GetAnalyticsParams } from '../api.dtos';

@Injectable()
export class WeekAnalyticsRepository {
  constructor(
    @InjectModel(WeekAnalytics.name)
    private readonly weekAnalyticsModel: Model<WeekAnalytics>
  ) {}

  findExistingAnalyticsData(
    params: GetAnalyticsParams
  ): Promise<WeekAnalytics> {
    return this.weekAnalyticsModel
      .findOne({
        network: params.network,
        year: params.year,
        week_id: params.week_id,
      })
      .exec();
  }

  storeNewAnalyticsData(
    weekAnalytics: WeekAnalyticsData,
    ipfsHash: string,
    params: GetAnalyticsParams
  ): Promise<WeekAnalytics> {
    return this.weekAnalyticsModel.create({
      ...weekAnalytics,
      ...params,
      ipfsHash,
    });
  }
}
