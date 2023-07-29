import { TFunction } from 'i18next';
import { ReactElement } from 'react';
import {
  FailSystemRequirements,
  FailSystemRequirementsData,
} from '../../../main/minSystemRequirement';

import { ChecklistItemProps } from '../../Generics/redesign/Checklist/ChecklistItem';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import { bytesToGB } from '../../utils';

export const makeCheckList = (
  t: TFunction,
  failSystemRequirementsData?: FailSystemRequirementsData
) => {
  const newChecklistItems: ChecklistItemProps[] = [];
  if (!failSystemRequirementsData) {
    return newChecklistItems;
  }
  const { operatingSystem, failedRequirements } = failSystemRequirementsData;

  failedRequirements.forEach((failedRequirement: FailSystemRequirements) => {
    const reqType = failedRequirement.type;
    // title and desc depends on req type
    // title and desc depends on whether the req is met or not
    // if cpu, if cores meets, add success
    //    if minSpeed doesn't meet
    let checkTitle = '';
    let valueText = '';
    let valueComponent: ReactElement = <></>;
    let captionText = '';
    const status = 'incomplete';
    if (reqType === 'OS') {
      checkTitle = `${operatingSystem} version`;
      valueText = `${failedRequirement.value}`;
      captionText = `Min. requirement: ${failedRequirement.requirement} or later. Please update your system to a more recent version.`;
    } else if (reqType === 'TotalMemory') {
      checkTitle = `At least ${bytesToGB(
        failedRequirement.requirement as number
      )}GB of system memory (RAM)`;
      valueText = `System memory: ${bytesToGB(
        failedRequirement.value as number
      )}GB`;
      captionText = `Increase your RAM to the required amount.`;
    } else if (reqType === 'CpuCores') {
      checkTitle = `Processor has ${failedRequirement.requirement} or more cores`;
      valueText = `${t('processorCoresDescription', {
        cores: failedRequirement.value,
      })}`;
      captionText = `Mac with a better processor is required.`;
    } else if (reqType === 'VirtualMachinePlatform') {
      checkTitle = `Virtual Machine Platform Enabled`;
      valueText = `Currently disabled.`;
      valueComponent = (
        <>
          <ExternalLink
            text="Manually enable Virtual Machine feature"
            url="https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-3---enable-virtual-machine-feature"
            inline
          />
        </>
      );
      captionText = `Try following  to enable.`;
    } else if (reqType === 'CpuArch') {
      checkTitle = `64bit CPU architecture`;
      valueText = `CPU architecture: ${failedRequirement.value}`;
      captionText = `This CPU does not support the 64-bit instruction set. Different processor is required.`;
    }

    const checkListItem: ChecklistItemProps = {
      checkTitle,
      valueText,
      valueComponent,
      captionText,
      status,
    };
    newChecklistItems.push(checkListItem);
  });
  return newChecklistItems;
};
