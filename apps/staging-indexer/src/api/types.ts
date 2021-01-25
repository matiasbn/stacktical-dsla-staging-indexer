export interface GetSLIParams {
  sla_address: string;
  sla_monitoring_start: string;
  sla_monitoring_end: string;
}

export interface GetSLIResponse {
  data: ValidatorDataWithIPFSHash;
  sliData: string;
}

export interface GetAnalyticsParams {
  network: string;
  year: number;
  week_id: number;
}

export interface GetAnalyticsResponse extends WeekAnalyticsData {
  ipfsHash: string;
}

export interface WeekAnalyticsData {
  week_id: number;
  week_analytics: {
    [key: string]: ValidatorData;
  };
}

export interface ValidatorDataWithIPFSHash extends ValidatorData {
  ipfsHash: string;
}

export interface ValidatorData {
  total: number;
  total_stake: number;
  hits: number;
  staking_efficiency_percent;
  misses: number;
  delegators: Array<string>;
}
