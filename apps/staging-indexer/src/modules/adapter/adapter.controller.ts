import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AdapterService } from './adapter.service';
import {
  GetSLIParams,
  GetAnalyticsParams,
  AdapterResponse,
} from './adapter.types';

@Controller('adapter')
export class AdapterController {
  constructor(
    private readonly adapterService: AdapterService,
    private readonly logger: Logger
  ) {}

  @Post()
  async adapterController(@Body() body): Promise<AdapterResponse> {
    const { id, data } = body;
    this.logger.log(body);
    switch (data.job_type) {
      case 'get_sli':
        // eslint-disable-next-line no-case-declarations
        const getSLIParams: GetSLIParams = {
          sla_monitoring_start: data.sla_monitoring_start,
          sla_monitoring_end: data.sla_monitoring_end,
          sla_address: data.sla_address,
        };
        return {
          jobRunID: id,
          data: {
            result: await this.adapterService.getSLIAdapterData(getSLIParams),
          },
        };
      case 'publish_analytics':
        // eslint-disable-next-line no-case-declarations
        const getAnalyticsParams: GetAnalyticsParams = {
          network_name: data.network_name,
          week_id: data.week_id,
          sla_monitoring_start: data.sla_monitoring_start,
          sla_monitoring_end: data.sla_monitoring_end,
        };
        return {
          jobRunID: id,
          data: {
            result: await this.adapterService.getAnalyticsAdapterData(
              getAnalyticsParams
            ),
          },
        };

      default:
        throw new Error('Job type not identified');
    }
  }
}
