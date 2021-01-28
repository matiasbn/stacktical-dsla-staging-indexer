import { Injectable, Logger } from '@nestjs/common';
import {
  GetAnalyticsParams,
  GetSLIParams,
  WeekAnalyticsData,
} from './adapter.types';
import { AdapterHelpers } from './adapter.helpers';
import { AnalyticsRepository } from './analytics.repository';
import { fromAscii, padRight } from 'web3-utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdapterService {
  constructor(
    private readonly weekAnalyticsRepository: AnalyticsRepository,
    private readonly adapterHelpers: AdapterHelpers,
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {
    this.logger = new Logger(AdapterService.name);
  }

  // it should return hits,misses
  async getSLIAdapterData(params: GetSLIParams): Promise<string> {
    const slaData = await this.adapterHelpers.getSLAData(params.sla_address);
    this.logger.log('SLA Data from IFPS:');
    this.logger.log(slaData);
    const analyticsData = await this.adapterHelpers.getAnalyticsFromSLARegistry(
      params,
      slaData.serviceTicker
    );
    this.logger.log('Analytics data:');
    this.logger.log(analyticsData);
    const { hits, misses } = analyticsData.week_analytics[slaData.serviceName];
    this.logger.log('hits: ' + hits + ', misses: ' + misses);
    const response = padRight(fromAscii(hits + ',' + misses), 64);
    this.logger.log('hits,misses parsed to bytes32: ' + response);
    return response;
  }

  async getAnalyticsAdapterData(params: GetAnalyticsParams): Promise<string> {
    const existingWeekAnalytics = await this.weekAnalyticsRepository.findExistingAnalyticsData(
      params
    );

    const week_analytics: WeekAnalyticsData =
      existingWeekAnalytics?.week_analytics ||
      this.adapterHelpers.createWeekAnalyticsData(params.network_name);

    const weekAnalyticsData = {
      week_id: params.week_id,
      week_analytics,
    };
    this.logger.log('Week analytics data: ');
    this.logger.log(weekAnalyticsData);
    const ipfsHash = await this.adapterHelpers.storeDataOnIFPS(
      weekAnalyticsData
    );
    this.logger.log('Analytics IPFS url:');
    this.logger.log(
      this.configService.get<string>('IPFS_URI') + '/ipfs/' + ipfsHash
    );
    await this.weekAnalyticsRepository.storeNewAnalyticsData(
      params,
      ipfsHash,
      weekAnalyticsData.week_analytics
    );
    return this.adapterHelpers.ipfsHashToBytes32(ipfsHash);
  }
}
