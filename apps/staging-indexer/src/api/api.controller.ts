import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { ApiService } from './api.service';
import {
  GetSLIParams,
  GetSLIResponse,
  GetAnalyticsParams,
  GetAnalyticsResponse,
} from './types';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}
  private readonly logger = new Logger(ApiController.name);

  @Post()
  async getSLI(@Body() body) {
    const { id, data } = body;
    const params: GetSLIParams = {
      sla_monitoring_start: data.sla_monitoring_start,
      sla_monitoring_end: data.sla_monitoring_end,
      sla_address: data.sla_address,
    };
    const responseObject = await this.apiService.getSLI(params);
    return {
      jobRunID: id,
      data: responseObject.sliData,
    };
  }

  @Get('params')
  async getSLIWithParams(@Query() params): Promise<GetSLIResponse> {
    const { query } = params;
    const paramsObject: GetSLIParams = query
      .split('\n')
      .filter((param) => /sla/.test(param))
      .reduce(
        (r, s) => ({
          ...r,
          [s.split(':')[0].trim()]: s.split(':')[1].trim().replace(/"/gi, ''),
        }),
        {}
      );
    this.logger.log(paramsObject);
    return await this.apiService.getSLI(paramsObject);
  }

  @Get('analytics/:network/:year/:week_id')
  getAnalytics(
    @Param() params: GetAnalyticsParams
  ): Promise<GetAnalyticsResponse> {
    return this.apiService.getWeekAnalytics(params);
  }
}
