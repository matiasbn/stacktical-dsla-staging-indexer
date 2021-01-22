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
    ipfsHash: string;
    delegators: Array<string>;
  };
  sliData: string;
}
