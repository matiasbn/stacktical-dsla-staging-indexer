import {
  HttpModule,
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdapterController } from './adapter.controller';
import { AdapterService } from './adapter.service';
import * as helmet from 'helmet';
import { AdapterHelpers } from './adapter.helpers';
import { AnalyticsRepository } from './analytics.repository';
import { Analytics, AnalyticsSchema } from './analytics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analytics.name, schema: AnalyticsSchema },
    ]),
    HttpModule,
  ],
  controllers: [AdapterController],
  providers: [Logger, AdapterService, AdapterHelpers, AnalyticsRepository],
})
export class AdapterModule {
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
