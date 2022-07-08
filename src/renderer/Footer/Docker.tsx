import { useEffect } from 'react';

import MenuDrawer from './MenuDrawer';
import { useGetIsDockerInstalledQuery } from '../state/settingsService';
import InstallDocker from '../Docker/InstallDocker';

type Props = {
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
};

const Docker = ({ isOpen, onClickCloseButton }: Props) => {
  const qIsDockerInstalled = useGetIsDockerInstalledQuery();
  useEffect(() => {
    if (isOpen) {
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
        <InstallDocker />
      </div>
    </MenuDrawer>
  );
};
export default Docker;
