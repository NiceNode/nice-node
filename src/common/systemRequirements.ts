export type CpuRequirements = {
  cores?: number;
  minSpeed?: number;
};
export type MemoryRequirements = {
  minSize?: number;
  minSpeed?: number;
};
export type StorageRequirements = {
  minSize?: number;
  minWriteSpeed?: number;
  ssdRequired?: boolean;
  // NVMe?
};
export type InternetRequirements = {
  minDownloadSpeed: number;
  minUploadSpeed: number;
  // and {{minUploadSpeed}} up
  // etherenetRequired?: boolean;
  // latency?
};
export type DockerRequirements = {
  required: boolean;
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
