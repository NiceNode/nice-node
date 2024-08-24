import { useEffect, useState } from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectSelectedNodePackage } from '../../state/node';
import type { ModalConfig } from '../ModalManager/modalUtils';
import Update from './Update';

export interface UpdateWrapperProps {
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
  modalOnClose: () => void;
  deeplink: string;
}

const UpdateWrapper = ({
  modalOnChangeConfig,
  modalOnClose,
  deeplink,
}: UpdateWrapperProps) => {
  const selectedNodePackage = useAppSelector(selectSelectedNodePackage);
  // const [sNodeStorageUsedGBs, setNodeStorageUsedGBs] = useState<number>();

  // useEffect(() => {
  //   console.log(selectSelectedNodePackage);
  //   if (selectedNodePackage?.runtime?.usage?.diskGBs) {
  //     const nodeStorageGBs = selectedNodePackage?.runtime?.usage?.diskGBs[0]?.y;
  //     setNodeStorageUsedGBs(nodeStorageGBs);
  //   } else {
  //     setNodeStorageUsedGBs(undefined);
  //   }
  //   modalOnChangeConfig({ selectedNodePackage });
  // }, [selectedNodePackage]);

  return (
    <Update
      deeplink={deeplink}
      modalOnClose={modalOnClose}
      modalOnChangeConfig={modalOnChangeConfig}
    />
  );
};

export default UpdateWrapper;
