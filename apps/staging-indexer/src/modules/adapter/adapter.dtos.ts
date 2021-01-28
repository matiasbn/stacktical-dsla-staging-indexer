import { IsIn, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { networks } from './adapter.helpers';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import moment from 'moment';

const startOf2020 = moment('01/01/2020', 'DD/MM/YYYY').startOf('year').unix();
const endtOf2021 = moment('01/01/2021', 'DD/MM/YYYY').endOf('year').unix();

export class GetAnalyticsData {
  @IsNotEmpty()
  @IsIn(Object.keys(networks))
  network_name: string;

  @IsNotEmpty()
  @Transform((period) => Number(period.value))
  @IsNumber()
  week_id: number;

  @IsNotEmpty()
  @Transform((start) => Number(start.value))
  @IsNumber()
  @Min(startOf2020)
  @Max(endtOf2021)
  sla_monitoring_start: number;

  @IsNotEmpty()
  @Transform((end) => Number(end.value))
  @IsNumber()
  @Min(startOf2020)
  @Max(endtOf2021)
  sla_monitoring_end: number;
}
