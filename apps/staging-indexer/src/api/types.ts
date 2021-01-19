export interface APIQuery {
  sla_address: string;
  sla_monitoring_start: string;
  sla_monitoring_end: string;
}

export interface APIResponse {
  data: {
    total: number;
    hits: number;
    misses: number;
    efficiency: number;
    delegators: Array<string>;
    totalStake: number;
  };
  sliData: string;
}
