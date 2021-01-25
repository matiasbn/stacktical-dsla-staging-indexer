import { Injectable } from '@nestjs/common';
import {
  GetAnalyticsParams,
  GetAnalyticsResponse,
  GetSLIParams,
  GetSLIResponse,
} from './types';
import { SLIRepository } from './domain/sli.repository';
import { ApiHelpers } from './api.helpers';
import { WeekAnalyticsRepository } from './domain/week-analytics.repository';

@Injectable()
export class ApiService {
  constructor(
    private readonly sliRepository: SLIRepository,
    private readonly weekAnalyticsRepository: WeekAnalyticsRepository,
    private readonly apiHelpers: ApiHelpers
  ) {}

  async getSLI(params: GetSLIParams): Promise<GetSLIResponse> {
    const existingSLI = await this.sliRepository.findExistingSLI(params);
    if (existingSLI) {
      return this.apiHelpers.parseGetSLIResponse(existingSLI);
    }

    const validatorData = this.apiHelpers.createValidatorData();
    const ipfsHash = await this.apiHelpers.storeDataOnIFPS(validatorData);

    const newSli = await this.sliRepository.storeNewSLI(params, {
      ...validatorData,
      ipfsHash,
    });

    return this.apiHelpers.parseGetSLIResponse(newSli);
  }

  async getWeekAnalytics(
    params: GetAnalyticsParams
  ): Promise<GetAnalyticsResponse> {
    const existingWeekAnalytics = await this.weekAnalyticsRepository.findExistingAnalyticsData(
      params
    );
    if (existingWeekAnalytics) {
      return this.apiHelpers.parseWeekAnalyticsResponse(existingWeekAnalytics);
    }

    const weekAnalyticsData = this.apiHelpers.createWeekAnalyticsData(
      params.network,
      params.week_id
    );
    const ipfsHash = await this.apiHelpers.storeDataOnIFPS(weekAnalyticsData);
    const newAnalytics = await this.weekAnalyticsRepository.storeNewAnalyticsData(
      weekAnalyticsData,
      ipfsHash,
      params
    );
    return this.apiHelpers.parseWeekAnalyticsResponse(newAnalytics);
  }
}
