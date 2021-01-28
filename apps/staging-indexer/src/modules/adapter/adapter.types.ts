export interface GetSLIParams {
  sla_address: string;
  week_id: number;
  sla_registry_address: string;
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
  [key: string]: ValidatorData;
}

export interface ValidatorData {
  total: number;
  total_stake: number;
  hits: number;
  staking_efficiency_percent;
  misses: number;
  delegators: Array<string>;
}

export interface SLAData {
  serviceName: string;
  serviceDescription: string;
  serviceImage: string;
  serviceURL: string;
  serviceAddress: string;
  serviceTicker: string;
}
