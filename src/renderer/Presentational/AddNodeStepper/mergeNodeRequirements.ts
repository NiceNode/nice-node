import type {
  CpuRequirements,
  // DockerRequirements,
  InternetRequirements,
  MemoryRequirements,
  StorageRequirements,
  SystemRequirements,
} from '../../../common/systemRequirements';

export const mergeSystemRequirements = (
  systemRequirementsArray: SystemRequirements[],
): SystemRequirements => {
  const mergedReqs: SystemRequirements = {};

  systemRequirementsArray.forEach((systemRequirements) => {
    for (const [nodeReqKey, nodeReqValue] of Object.entries(
      systemRequirements,
    )) {
      // console.log(`${nodeReqKey}: ${nodeReqValue}`);
      if (nodeReqKey === 'documentationUrl' || nodeReqKey === 'description') {
        continue;
      }
      if (nodeReqKey === 'cpu') {
        const req = nodeReqValue as CpuRequirements;
        if (!mergedReqs.cpu) {
          mergedReqs.cpu = {};
        }
        if (req.cores !== undefined) {
          if (!mergedReqs.cpu?.cores || mergedReqs?.cpu.cores < req.cores) {
            mergedReqs.cpu.cores = req.cores;
          }
        }
        if (req.minSpeedGHz !== undefined) {
          if (
            !mergedReqs.cpu?.minSpeedGHz ||
            mergedReqs?.cpu.minSpeedGHz < req.minSpeedGHz
          ) {
            mergedReqs.cpu.minSpeedGHz = req.minSpeedGHz;
          }
        }
      }
      if (nodeReqKey === 'memory') {
        const req = nodeReqValue as MemoryRequirements;
        if (!mergedReqs.memory) {
          mergedReqs.memory = {};
        }
        if (req.minSizeGBs !== undefined) {
          if (!mergedReqs.memory?.minSizeGBs) {
            mergedReqs.memory.minSizeGBs = req.minSizeGBs;
          } else {
            mergedReqs.memory.minSizeGBs += req.minSizeGBs;
          }
        }
        if (req.minSpeedGHz !== undefined) {
          if (
            !mergedReqs.memory?.minSpeedGHz ||
            mergedReqs?.memory.minSpeedGHz < req.minSpeedGHz
          ) {
            mergedReqs.memory.minSpeedGHz = req.minSpeedGHz;
          }
        }
      }
      if (nodeReqKey === 'storage') {
        const req = nodeReqValue as StorageRequirements;
        if (!mergedReqs.storage) {
          mergedReqs.storage = {};
        }
        if (req.minSizeGBs !== undefined) {
          if (!mergedReqs.storage?.minSizeGBs) {
            mergedReqs.storage.minSizeGBs = req.minSizeGBs;
          } else {
            mergedReqs.storage.minSizeGBs += req.minSizeGBs;
          }
        }
        if (req.minWriteSpeedMBps !== undefined) {
          if (
            !mergedReqs.storage?.minWriteSpeedMBps ||
            mergedReqs?.storage.minWriteSpeedMBps < req.minWriteSpeedMBps
          ) {
            mergedReqs.storage.minWriteSpeedMBps = req.minWriteSpeedMBps;
          }
        }
        if (req.ssdRequired === true) {
          if (!mergedReqs.storage?.ssdRequired) {
            mergedReqs.storage.ssdRequired = true;
          }
        }
      }
      if (nodeReqKey === 'internet') {
        const req = nodeReqValue as InternetRequirements;
        if (!mergedReqs.internet) {
          mergedReqs.internet = {};
        }
        if (req.minDownloadSpeedMbps !== undefined) {
          if (!mergedReqs.internet?.minDownloadSpeedMbps) {
            mergedReqs.internet.minDownloadSpeedMbps = req.minDownloadSpeedMbps;
          } else {
            mergedReqs.internet.minDownloadSpeedMbps +=
              req.minDownloadSpeedMbps;
          }
        }
        if (req.minUploadSpeedMbps !== undefined) {
          if (!mergedReqs.internet?.minUploadSpeedMbps) {
            mergedReqs.internet.minUploadSpeedMbps = req.minUploadSpeedMbps;
          } else {
            mergedReqs.internet.minUploadSpeedMbps += req.minUploadSpeedMbps;
          }
        }
      }
      // if (nodeReqKey === 'docker') {
      //   const req = nodeReqValue as DockerRequirements;
      //   if (!mergedReqs.docker) {
      //     mergedReqs.docker = {};
      //   }
      //   if (req.required === true) {
      //     mergedReqs.docker.required = true;
      //   }
      //   if (req.minVersion !== undefined) {
      //     // if a require docker version is higher than other versions,
      //     //   the highest(newest) version takes priority.
      //     if (
      //       !mergedReqs.docker?.minVersion ||
      //       mergedReqs?.docker.minVersion < req.minVersion
      //     ) {
      //       mergedReqs.docker.minVersion = req.minVersion;
      //     }
      //   }
      // }
      // set a value on mergedReqs todo
    }
  });
  return mergedReqs;
};
