import { TFunction } from 'react-i18next';
import {
  CpuRequirements,
  DockerRequirements,
  InternetRequirements,
  MemoryRequirements,
  StorageRequirements,
} from '../../../common/systemRequirements';

import { ChecklistItemProps } from '../../Generics/redesign/Checklist/ChecklistItem';
import { bytesToGB } from '../../utils';
// eslint-disable-next-line import/no-cycle
import { NodeRequirementsProps } from './NodeRequirements';

export const makeCheckList = (
  { nodeRequirements, systemData }: NodeRequirementsProps,
  t: TFunction<'systemRequirements', undefined>
) => {
  const newChecklistItems: ChecklistItemProps[] = [];
  if (!nodeRequirements) {
    return newChecklistItems;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const [nodeReqKey, nodeReqValue] of Object.entries(nodeRequirements)) {
    console.log(`${nodeReqKey}: ${nodeReqValue}`);
    // title and desc depends on req type
    // title and desc depends on whether the req is met or not
    // if cpu, if cores meets, add success
    //    if minSpeed doesn't meet
    let checkTitle = '';
    let valueText = '';
    let status: ChecklistItemProps['status'] = 'loading';
    if (nodeReqKey === 'cpu') {
      const req = nodeReqValue as CpuRequirements;
      if (req.cores !== undefined) {
        checkTitle = t('processorCoresTitle', {
          minCores: req.cores,
        });
        if (systemData.cpu?.cores) {
          valueText = t('processorCoresDescription', {
            cores: systemData.cpu.cores,
          });
          if (systemData.cpu.cores >= req.cores) {
            status = 'complete';
          } else {
            status = 'incomplete';
          }
        } else {
          status = 'error';
        }
      }
    }
    if (nodeReqKey === 'memory') {
      const req = nodeReqValue as MemoryRequirements;
      if (req.minSize !== undefined) {
        checkTitle = t('memorySizeTitle', {
          minSize: bytesToGB(req.minSize),
        });
        if (systemData.memLayout[0]?.size) {
          valueText = t('memorySizeDescription', {
            size: bytesToGB(systemData.memLayout[0]?.size),
          });
          if (systemData.memLayout[0]?.size >= req.minSize) {
            status = 'complete';
          } else {
            status = 'incomplete';
          }
        } else {
          status = 'error';
        }
      }
    }
    if (nodeReqKey === 'storage') {
      const req = nodeReqValue as StorageRequirements;
      const disk = systemData.diskLayout[0];
      if (req.ssdRequired === true) {
        checkTitle = t('storageTypeTitle', {
          type: 'SSD',
        });
        if (disk?.type || disk?.name) {
          if (disk?.type.includes('SSD') || disk?.name.includes('SSD')) {
            valueText = t('storageTypeDescription', {
              size: 'SSD',
            });
            status = 'complete';
          } else if (disk?.type.includes('HDD') || disk?.name.includes('HDD')) {
            valueText = t('storageTypeDescription', {
              size: 'HDD',
            });
          } else {
            status = 'incomplete';
          }
        } else {
          status = 'error';
        }
        const checkListItem: ChecklistItemProps = {
          checkTitle,
          valueText,
          status,
        };
        newChecklistItems.push(checkListItem);
      }
      if (req.minSize !== undefined) {
        checkTitle = t('storageSizeTitle', {
          minSize: req.minSize,
        });
        if (disk?.size) {
          const diskSizeGbs = bytesToGB(disk.size);
          // todo: use free space for storage calculations?
          valueText = t('storageSizeDescription', {
            freeSize: diskSizeGbs,
            storageName: disk.name,
          });
          if (diskSizeGbs >= req.minSize) {
            status = 'complete';
          } else {
            status = 'incomplete';
          }
        } else {
          status = 'error';
        }
      }
    }
    if (nodeReqKey === 'internet') {
      const req = nodeReqValue as InternetRequirements;
      if (req.minDownloadSpeed !== undefined) {
        checkTitle = t('internetDownloadSpeedTitle', {
          minSize: req.minDownloadSpeed,
        });
        valueText = 'Give permissions to run an internet speed test';
        status = 'loading';
      }
    }
    if (nodeReqKey === 'memory') {
      const req = nodeReqValue as DockerRequirements;
      if (req.required === true) {
        checkTitle = t('memorySizeTitle', {
          minSize: bytesToGB(req.required),
        });
        if (systemData.memLayout[0]?.size) {
          valueText = t('memorySizeDescription', {
            size: bytesToGB(systemData.memLayout[0]?.size),
          });
          if (systemData.memLayout[0]?.size >= req.minSize) {
            status = 'complete';
          } else {
            status = 'incomplete';
          }
        } else {
          status = 'error';
        }
      }
    }

    const checkListItem: ChecklistItemProps = {
      checkTitle,
      valueText,
      status,
    };
    newChecklistItems.push(checkListItem);
  }
  return newChecklistItems;
};
