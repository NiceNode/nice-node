import { useEffect, useState } from 'react';

import electron from '../electronGlobal';
import MenuDrawer from './MenuDrawer';
import { useGetIsDockerInstalledQuery } from '../state/settingsService';

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
        <div>Is docker installed? {JSON.stringify(isDockerInstalled)}</div>
        {/* todo: if win */}
        <button
          type="button"
          onClick={async () => {
            console.log('calling installDocker');
            await electron.installDocker();
            console.log('installDocker finished');
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Install Docker
          </div>
        </button>
      </div>
    </MenuDrawer>
  );
};
export default Docker;
