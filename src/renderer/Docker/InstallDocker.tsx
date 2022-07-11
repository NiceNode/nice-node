import { useTranslation } from 'react-i18next';
import { FaDocker } from 'react-icons/fa';
import { Settings } from '../../main/state/settings';
import ExternalLink from '../Generics/ExternalLink';
import { useGetSettingsQuery } from '../state/settingsService';
import InstallDockerButton from './InstallDockerButton';

const InstallDocker = () => {
  const { t } = useTranslation();
  const qSettings = useGetSettingsQuery();

  let isLinux;
  if (qSettings?.data) {
    const settings: Settings = qSettings.data;
    isLinux = settings.osPlatform === 'linux';
  }

  return (
    <div style={{ paddingRight: 40 }}>
      <h1>
        {t('Install Docker')} <FaDocker />
      </h1>
      <p style={{ fontSize: '1.2em' }}>{t('dockerPurpose')}</p>
      {!isLinux && <InstallDockerButton />}
      <p>{t('restartDockerOnInstall')}</p>
      <p>{t('ensureDockerIsRunning')}</p>
      {!isLinux && <h3>{t('installDockerOnYourOwn')}</h3>}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          padding: 20,
          display: 'inline-block',
        }}
      >
        <ExternalLink
          title={t('dockerInstallGuide')}
          url="https://docs.docker.com/desktop/#download-and-install"
        />
      </div>
    </div>
  );
};
export default InstallDocker;
