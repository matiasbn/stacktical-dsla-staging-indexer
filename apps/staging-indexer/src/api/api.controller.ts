import { Controller, Get, Logger, Query } from '@nestjs/common';

import { ApiService } from './api.service';
import { APIQuery } from './types';

@Controller('api')
export class ApiController {
  constructor(private readonly appService: ApiService) {}
  private readonly logger = new Logger(ApiController.name);

  @Get()
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
