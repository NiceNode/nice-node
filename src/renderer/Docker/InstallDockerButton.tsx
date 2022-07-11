import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import electron from '../electronGlobal';
import { useGetIsDockerInstalledQuery } from '../state/settingsService';

const InstallDockerButton = () => {
  const { t } = useTranslation();
  const [sDockerInstallStatus, setDockerInstallStatus] = useState<string>();
  const qIsDockerInstalled = useGetIsDockerInstalledQuery();
  const isDockerInstalled = qIsDockerInstalled?.data;

  if (isDockerInstalled) {
    return <></>;
  }

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          console.log('calling installDocker');
          setDockerInstallStatus(t('dockerInstallingMessage'));
          const installResult = await electron.installDocker();
          if (installResult?.error) {
            setDockerInstallStatus(`Error: ${installResult.error}`);
          } else if (installResult?.message) {
            setDockerInstallStatus(`${installResult.message}`);
          } else {
            setDockerInstallStatus(
              `Installed successfully! Please restart NiceNode.`
            );
          }
          console.log(
            'installDocker finished. Install result: ',
            installResult
          );
          qIsDockerInstalled.refetch();
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {t('Install Docker')}
        </div>
      </button>
      {sDockerInstallStatus !== undefined && (
        <div>
          {t('dockerInstallStatus')} {sDockerInstallStatus}
        </div>
      )}
    </>
  );
};
export default InstallDockerButton;
