export interface GetSLIParams {
  sla_address: string;
  sla_monitoring_start: string;
  sla_monitoring_end: string;
}

export interface GetAnalyticsParams {
  network_name: string;
  week_id: number;
  sla_monitoring_start: number;
  sla_monitoring_end: number;
}

export interface AdapterResponse {
  jobRunID: string;
  data: {
    result: string;
  };
}

export interface WeekAnalyticsData {
  week_id: number;
  week_analytics: {
    [key: string]: ValidatorData;
  };
}

export interface ValidatorData {
  total: number;
  total_stake: number;
  hits: number;
  staking_efficiency_percent;
  misses: number;
  delegators: Array<string>;
}
