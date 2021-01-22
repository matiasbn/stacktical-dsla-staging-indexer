export interface APIQuery {
  sla_address: string;
  sla_monitoring_start: string;
  sla_monitoring_end: string;
}

export interface APIResponse {
  data: IPFSDataWithHash;
  sliData: string;
}

export interface IPFSData {
  total: number;
  totalStake: number;
  hits: number;
  efficiency: number;
  misses: number;
  delegators: Array<string>;
}

export interface IPFSDataWithHash extends IPFSData {
  ipfsHash: string;
}
