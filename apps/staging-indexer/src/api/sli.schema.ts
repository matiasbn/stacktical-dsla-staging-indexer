import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SLI extends Document {
  @Prop({ required: true })
  slaAddress: string;

  @Prop({ required: true })
  slaMonitoringStart: string;

  @Prop({ required: true })
  slaMonitoringEnd: string;

  @Prop({ required: true })
  hits: number;

  @Prop({ required: true })
  misses: number;

  @Prop({ required: true })
  validations: number;

  @Prop({ required: true })
  efficiency: number;
}

export const SLISchema = SchemaFactory.createForClass(SLI);
