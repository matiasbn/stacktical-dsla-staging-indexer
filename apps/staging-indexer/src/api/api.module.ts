import {
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { SLI, SLISchema } from './sli.schema';
import * as helmet from 'helmet';
import { SLIRepository } from './sli.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: SLI.name, schema: SLISchema }])],
  controllers: [ApiController],
  providers: [Logger, ApiService, SLIRepository],
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
