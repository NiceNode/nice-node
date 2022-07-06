import { useEffect } from 'react';

import MenuDrawer from './MenuDrawer';
import { useGetIsDockerInstalledQuery } from '../state/settingsService';
import InstallDockerButton from '../Docker/InstallDockerButton';

type Props = {
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
};

const Docker = ({ isOpen, onClickCloseButton }: Props) => {
  const qIsDockerInstalled = useGetIsDockerInstalledQuery();
  // const isDisabled = true;
  const isDockerInstalled = qIsDockerInstalled?.data;
  useEffect(() => {
    if (isOpen) {
      // getDockerData();
      qIsDockerInstalled.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <MenuDrawer
      title="Docker"
      isSelected={!!isOpen}
      onClickCloseButton={onClickCloseButton}
    >
      <div style={{ flex: 1, overflow: 'auto' }}>
        {qIsDockerInstalled.isLoading && <>Loading...</>}
        <div>
          {isDockerInstalled
            ? 'Docker is installed'
            : 'Docker is not installed or it is not running.'}
        </div>
        {/* todo: if win */}
        <InstallDockerButton />
      </div>
    </MenuDrawer>
  );
};
export default Docker;
