import { useState } from 'react';

import electron from '../electronGlobal';
import { useGetIsDockerInstalledQuery } from '../state/settingsService';

const InstallDockerButton = () => {
  const [sDockerInstallStatus, setDockerInstallStatus] = useState<string>();
  const qIsDockerInstalled = useGetIsDockerInstalledQuery();
  // const isDisabled = true;
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
          setDockerInstallStatus(
            'Installing... (this may take 5 or more minutes). There will be a password prompt on Mac to give permissions to install Docker.'
          );
          const installResult = await electron.installDocker();
          if (installResult && installResult.error) {
            setDockerInstallStatus(`Error: ${installResult.error}`);
          } else {
            setDockerInstallStatus(`Installed successfully!`);
          }
          console.log(
            'installDocker finished. Install result: ',
            installResult
          );
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Install Docker
        </div>
      </button>
      {sDockerInstallStatus !== undefined && (
        <div>Docker install status: {sDockerInstallStatus}</div>
      )}
    </>
  );
};
export default InstallDockerButton;
