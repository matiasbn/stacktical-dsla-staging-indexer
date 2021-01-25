import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ValidatorData } from '../types';

@Schema({ timestamps: true })
export class WeekAnalytics extends Document {
  @Prop({ required: true })
  network: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  week_id: number;

  @Prop({ required: true })
  ipfsHash: string;

  @Prop({ required: true, type: Object })
  week_analytics: {
    [key: string]: ValidatorData;
  };
}

export const WeekAnalyticsSchema = SchemaFactory.createForClass(WeekAnalytics);
