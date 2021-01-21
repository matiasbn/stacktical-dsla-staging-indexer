import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';

import { ApiService } from './api.service';
import { APIQuery } from './types';

@Controller('api')
export class ApiController {
  constructor(private readonly appService: ApiService) {}
  private readonly logger = new Logger(ApiController.name);

  @Post()
  async getSLI(@Body() body) {
    const { id, data } = body;
    const params: APIQuery = {
      sla_monitoring_start: data.sla_monitoring_start,
      sla_monitoring_end: data.sla_monitoring_end,
      sla_address: data.sla_address,
    };
    const responseObject = await this.appService.getSLI(params);
    return {
      jobRunID: id,
      data: responseObject.sliData,
    };
  }

  @Get('params')
  getData(@Query() params) {
    const { query } = params;
    const paramsObject: APIQuery = query
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
    return this.appService.getSLI(paramsObject);
  }
}
