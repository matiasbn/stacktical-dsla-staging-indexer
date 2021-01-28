import { Injectable, Logger } from '@nestjs/common';
import {
  GetAnalyticsParams,
  GetSLIParams,
  WeekAnalyticsData,
} from './adapter.types';
import { AdapterHelpers } from './adapter.helpers';
import { AnalyticsRepository } from './analytics.repository';

@Injectable()
export class AdapterService {
  constructor(
    private readonly weekAnalyticsRepository: AnalyticsRepository,
    private readonly apiHelpers: AdapterHelpers,
    private readonly logger: Logger
  ) {}

  async getSLIAdapterData(params: GetSLIParams): Promise<string> {
    return '';
  }

  async getAnalyticsAdapterData(params: GetAnalyticsParams): Promise<string> {
    const existingWeekAnalytics = await this.weekAnalyticsRepository.findExistingAnalyticsData(
      params
    );
    if (existingWeekAnalytics) {
      const weekAnalyticsData: WeekAnalyticsData = {
        week_id: params.week_id,
        week_analytics: existingWeekAnalytics.week_analytics,
      };
      const ipfsHash = await this.apiHelpers.storeDataOnIFPS(weekAnalyticsData);
      return this.apiHelpers.ipfsHashToBytes32(ipfsHash);
    }
    // monitoring start and end are only necessary for the real indexer
    this.logger.log(
      'monitoring_start: ' +
        params.sla_monitoring_start +
        ', sla_monitoring_end: ' +
        params.sla_monitoring_end
    );
    const weekAnalyticsData = this.apiHelpers.createWeekAnalyticsData(
      params.network_name,
      params.week_id
    );
    const ipfsHash = await this.apiHelpers.storeDataOnIFPS(weekAnalyticsData);
    await this.weekAnalyticsRepository.storeNewAnalyticsData(
      params,
      ipfsHash,
      weekAnalyticsData
    );
    return this.apiHelpers.ipfsHashToBytes32(ipfsHash);
  }
}
