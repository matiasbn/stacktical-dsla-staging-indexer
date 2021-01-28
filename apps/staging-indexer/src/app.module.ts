import { HttpModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import * as Joi from '@hapi/joi';
import { AdapterModule } from './modules/adapter/adapter.module';

class ExtendedLogger extends Logger {
  write(message: string) {
    super.log(message.trim());
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('develop', 'staging', 'production')
          .default('develop'),
        MONGODB_URI: Joi.string().required(),
        IPFS_URI: Joi.string().required(),
        WEB3_URI: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MorganModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    AdapterModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor(
        ':method :url :status :res[content-length] - :response-time ms',
        { stream: new ExtendedLogger() }
      ),
    },
  ],
})
export class AppModule {}
