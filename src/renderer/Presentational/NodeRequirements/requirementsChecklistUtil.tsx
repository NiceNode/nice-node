import { ReactElement } from 'react';
import { TFunction } from 'react-i18next';
import {
  CpuRequirements,
  DockerRequirements,
  InternetRequirements,
  MemoryRequirements,
  StorageRequirements,
} from '../../../common/systemRequirements';

import { ChecklistItemProps } from '../../Generics/redesign/Checklist/ChecklistItem';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
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
    if (nodeReqKey === 'documentationUrl' || nodeReqKey === 'description') {
      // eslint-disable-next-line no-continue
      continue;
    }
    // title and desc depends on req type
    // title and desc depends on whether the req is met or not
    // if cpu, if cores meets, add success
    //    if minSpeed doesn't meet
    let checkTitle = '';
    let valueText = '';
    let valueComponent: ReactElement = <></>;
    let captionText = '';
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
              type: 'SSD',
            });
            status = 'complete';
          } else if (disk?.type.includes('HDD') || disk?.name.includes('HDD')) {
            valueText = t('storageTypeDescription', {
              type: 'HDD',
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
        checkTitle = t('internetSpeedTitle', {
          minDownloadSpeed: req.minDownloadSpeed,
          minUploadSpeed: req.minUploadSpeed,
        });
        valueText =
          'Please do your own internet speed test to ensure it meets these requirements!';
        valueComponent = (
          <>
            You can check the speed at one of the following websites{' '}
            <ExternalLink
              text="Google Speed Test"
              url="https://www.google.com/search?q=speed+test"
              inline
            />{' '}
            or{' '}
            <ExternalLink
              text="Speedtest by Ookla"
              url="https://speedtest.net"
              inline
            />
          </>
        );
        status = 'information';
      }
    }
    if (nodeReqKey === 'docker') {
      const req = nodeReqValue as DockerRequirements;
      if (req.required === true) {
        if (req.minVersion) {
          checkTitle = t('dockerVersionInstalledTitle', {
            minVersion: req.minVersion,
          });
        } else {
          // case where no specific docker version is required
          checkTitle = t('dockerInstalledTitle');
        }
        if (systemData.versions.docker) {
          // !req.minVersion: case where no specific docker version is required
          if (!req.minVersion || systemData.versions.docker >= req.minVersion) {
            valueText = t('dockerVersionInstalledDescription', {
              version: systemData.versions.docker,
            });
            status = 'complete';
          } else {
            captionText = t('dockerVersionInstalledNeedsUpdateCaption');
            status = 'incomplete';
          }
        } else {
          status = 'incomplete';
        }
      }
    }

    const checkListItem: ChecklistItemProps = {
      checkTitle,
      valueText,
      valueComponent,
      captionText,
      status,
    };
    newChecklistItems.push(checkListItem);
  }
  return newChecklistItems;
};
