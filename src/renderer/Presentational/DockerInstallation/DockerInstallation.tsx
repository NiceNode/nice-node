import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  captionText,
  container,
  descriptionFont,
  titleFont,
} from './dockerInstallation.css';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import electron from '../../electronGlobal';
import Button from '../../Generics/redesign/Button/Button';
import ProgressBar from '../../Generics/redesign/ProgressBar/ProgressBar';
import { FileDownloadProgress } from '../../../main/downloadFile';
import { bytesToMB } from '../../utils';
import TimedProgressBar from '../../Generics/redesign/ProgressBar/TimedProgressBar';
import {
  useGetIsDockerInstalledQuery,
  useGetIsDockerRunningQuery,
} from '../../state/settingsService';
import ContentWithSideArt from '../../Generics/redesign/ContentWithSideArt/ContentWithSideArt';
import graphicsPng from '../../assets/images/artwork/NN-Onboarding-Artwork-03.png';

// 6.5 min on 2022 MacbookPro 16inch, baseline
const TOTAL_INSTALL_TIME_SEC = 7 * 60;
export interface DockerInstallationProps {
  /**
   * Listen to node config changes
   */
  onChange: (newValue: string) => void;
}

const DockerInstallation = ({ onChange }: DockerInstallationProps) => {
  const { t } = useTranslation();
  const qIsDockerInstalled = useGetIsDockerInstalledQuery();
  const isDockerInstalled = qIsDockerInstalled?.data;
  const qIsDockerRunning = useGetIsDockerRunningQuery(null, {
    pollingInterval: 15000,
  });
  const isDockerRunning = qIsDockerRunning?.data;
  const [sHasStartedDownload, setHasStartedDownload] = useState<boolean>();
  const [sDownloadComplete, setDownloadComplete] = useState<boolean>();
  const [sDownloadProgress, setDownloadProgress] = useState<number>(0);
  const [sTotalSizeBytes, setTotalSizeBytes] = useState<number>(0);
  const [sDownloadedBytes, setDownloadedBytes] = useState<number>(0);
  const [sInstallComplete, setInstallComplete] = useState<boolean>();

  useEffect(() => {
    if (isDockerRunning) {
      onChange('done');
    }
  }, [isDockerRunning, onChange]);

  const onClickDownloadAndInstall = async () => {
    setHasStartedDownload(true);
    const installResult = await electron.installDocker();
    qIsDockerInstalled.refetch();
    qIsDockerRunning.refetch();
    if (installResult && !installResult.error) {
      setInstallComplete(true);
      // notify parent that everything is done
      // todo: confirm/check docker version installed?
    }
    console.log('installDocker finished. Install result: ', installResult);
  };

  const onClickStartDocker = async () => {
    setHasStartedDownload(true);
    const installResult = await electron.startDocker();
    qIsDockerRunning.refetch();
    console.log('installDocker finished. Install result: ', installResult);
  };

  const nodeLogsListener = (message: FileDownloadProgress[]) => {
    // set totalSize & progress
    if (message[0]) {
      console.log('downloadupdate: ', message[0]);
      setTotalSizeBytes(message[0].totalBytes);
      setDownloadedBytes(message[0].downloadedBytes);
      setDownloadProgress(
        (message[0].downloadedBytes / message[0].totalBytes) * 100
      );
      // if downloaded = total, then complete?
      if (message[0].downloadedBytes === message[0].totalBytes) {
        console.log('downloaded = total bytes. download complete');
        setDownloadComplete(true);
      }
    } else {
      console.error('recieved empty docker message');
    }
  };

  const listenForDockerInstallUpdates = useCallback(async () => {
    electron.ipcRenderer.on('docker', nodeLogsListener);
  }, []);

  useEffect(() => {
    console.log('DockerInstallation.tsx: listenForDockerInstallUpdates .');
    listenForDockerInstallUpdates();
    return () => electron.ipcRenderer.removeAllListeners('docker');
  }, [listenForDockerInstallUpdates]);

  // listen to docker install messages
  return (
    <ContentWithSideArt graphic={graphicsPng}>
      <div className={container}>
        <div className={titleFont}>{t('DockerInstallation')}</div>
        <div className={descriptionFont}>
          <>{t('dockerPurpose')}</>
        </div>
        <ExternalLink
          text={t('LearnMoreDocker')}
          url="https://www.docker.com/products/docker-desktop/"
        />
        {/* Docker is not installed */}
        {!isDockerInstalled && (
          <>
            {!sDownloadComplete && !sInstallComplete && (
              <>
                {!sHasStartedDownload ? (
                  <div>
                    <Button
                      type="primary"
                      label={t('DownloadAndInstall')}
                      onClick={onClickDownloadAndInstall}
                    />
                    <div className={captionText}>~600MB {t('download')}</div>
                  </div>
                ) : (
                  <ProgressBar
                    progress={sDownloadProgress}
                    title={t('DownloadingDocker')}
                    caption={t('DownloadedSomeMegaBytesOfTotal', {
                      downloadedBytes: bytesToMB(sDownloadedBytes),
                      totalBytes: bytesToMB(sTotalSizeBytes),
                    })}
                  />
                )}
              </>
            )}
            {sDownloadComplete && !sInstallComplete && (
              <TimedProgressBar
                totalTimeSeconds={TOTAL_INSTALL_TIME_SEC}
                title={t('InstallingDocker')}
              />
            )}
          </>
        )}

        {sDownloadComplete && sInstallComplete && (
          <p>{t('DockerInstallComplete')}</p>
        )}
        {/* Docker is installed but not running */}
        {isDockerInstalled && !isDockerRunning && (
          <>
            <Button
              type="primary"
              label={t('start docker')}
              onClick={onClickStartDocker}
            />
            <div className={captionText}>{t('DockerUncheckOpenAtStartup')}</div>
          </>
        )}
        {isDockerRunning && <>{t('DockerIsRunningProceed')}</>}
      </div>
    </ContentWithSideArt>
  );
};

export default DockerInstallation;
