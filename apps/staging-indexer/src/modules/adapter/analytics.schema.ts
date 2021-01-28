import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ValidatorData } from './adapter.types';

@Schema({ timestamps: true })
export class Analytics extends Document {
  @Prop({ required: true })
  network_name: string;

  @Prop({ required: true })
  sla_monitoring_start: number;

  @Prop({ required: true })
  sla_monitoring_end: number;

  @Prop({ required: true })
  ipfsHash: string;

  @Prop({ required: true })
  week_id: number;

  @Prop({ required: true, type: Object })
  week_analytics: {
    [key: string]: ValidatorData;
  };
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
