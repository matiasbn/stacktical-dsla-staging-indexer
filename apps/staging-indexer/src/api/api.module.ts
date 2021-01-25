import {
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { SLI, SLISchema } from './domain/sli.schema';
import * as helmet from 'helmet';
import { SLIRepository } from './domain/sli.repository';
import { ApiHelpers } from './api.helpers';
import { WeekAnalyticsRepository } from './domain/week-analytics.repository';
import {
  WeekAnalytics,
  WeekAnalyticsSchema,
} from './domain/week-analytics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SLI.name, schema: SLISchema },
      { name: WeekAnalytics.name, schema: WeekAnalyticsSchema },
    ]),
  ],
  controllers: [ApiController],
  providers: [
    Logger,
    ApiService,
    ApiHelpers,
    SLIRepository,
    WeekAnalyticsRepository,
  ],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(helmet())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(
        helmet.hsts({
          maxAge: 8000000,
        })
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
