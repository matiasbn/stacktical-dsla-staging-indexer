export interface APIQuery {
  sla_address: string;
  sla_monitoring_start: string;
  sla_monitoring_end: string;
}

export interface APIResponse {
  data: {
    total: number;
    totalStake: number;
    hits: number;
    efficiency: number;
    misses: number;
    delegators: Array<string>;
    getSLI: number;
  };
  sliData: string;
}
