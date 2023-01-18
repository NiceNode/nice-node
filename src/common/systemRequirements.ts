export type CpuRequirements = {
  cores?: number;
  minSpeedGHz?: number;
};
export type MemoryRequirements = {
  minSizeGBs?: number;
  minSpeedGHz?: number;
};
export type StorageRequirements = {
  minSizeGBs?: number;
  minWriteSpeedMBps?: number;
  ssdRequired?: boolean;
  // NVMe?
};
export type InternetRequirements = {
  minDownloadSpeedMbps?: number;
  minUploadSpeedMbps?: number;
  noDataCapRecommended?: boolean;
  // and {{minUploadSpeed}} up
  // etherenetRequired?: boolean;
  // latency?
};
export type DockerRequirements = {
  required?: boolean;
  minVersion?: string;
};

export type SystemRequirements = {
  documentationUrl?: string;
  description?: string;
  cpu?: CpuRequirements;
  memory?: MemoryRequirements;
  storage?: StorageRequirements;
  internet?: InternetRequirements;
  docker?: DockerRequirements;
};
