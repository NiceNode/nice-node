import { FaDocker } from 'react-icons/fa';
import { Settings } from '../../main/state/settings';
import ExternalLink from '../Generics/ExternalLink';
import { useGetSettingsQuery } from '../state/settingsService';
import InstallDockerButton from './InstallDockerButton';

const InstallDocker = () => {
  const qSettings = useGetSettingsQuery();

  let isLinux;
  if (qSettings?.data) {
    const settings: Settings = qSettings.data;
    isLinux = settings.osPlatform === 'linux';
  }

  return (
    <div style={{ paddingRight: 40 }}>
      <h1>
        Install Docker <FaDocker />
      </h1>
      <p style={{ fontSize: '1.2em' }}>
        {
          'Docker helps NiceNode provide many nodes for users to choose from. \
           Docker is supported by most node development teams and is free for users to install. \
           Installing Docker will give you access to all of the Ethereum nodes! Docker will quietly run in the background after installation.'
        }
      </p>
      {!isLinux && <InstallDockerButton />}
      <p>Restart NiceNode when Docker is installed and running.</p>
      <p>If you have Docker Desktop installed, ensure it is running.</p>
      {!isLinux && <h3>Install Docker on your own</h3>}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          padding: 20,
          display: 'inline-block',
        }}
      >
        <ExternalLink
          title="Docker Desktop install guide"
          url="https://docs.docker.com/desktop/#download-and-install"
        />
      </div>
    </div>
  );
};
export default InstallDocker;
