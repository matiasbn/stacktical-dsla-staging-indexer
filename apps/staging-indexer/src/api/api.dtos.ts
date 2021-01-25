import { IsIn, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { networks } from './api.helpers';

export class GetAnalyticsParams {
  @IsNotEmpty()
  @IsIn(Object.keys(networks))
  network: string;

  @IsNotEmpty()
  @Transform((year) => Number(year.value))
  @IsNumber()
  @Min(2020)
  @Max(2022)
  year: number;

  @IsNotEmpty()
  @Transform((week_id) => Number(week_id.value))
  @IsNumber()
  @Min(1)
  @Max(52)
  week_id: number;
}
