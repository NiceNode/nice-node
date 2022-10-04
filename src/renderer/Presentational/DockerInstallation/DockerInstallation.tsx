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
  const [sHasStartedDownload, setHasStartedDownload] = useState<boolean>();
  const [sDownloadComplete, setDownloadComplete] = useState<boolean>();
  const [sDownloadProgress, setDownloadProgress] = useState<number>(0);
  const [sTotalSizeBytes, setTotalSizeBytes] = useState<number>(0);
  const [sDownloadedBytes, setDownloadedBytes] = useState<number>(0);
  const [sInstallComplete, setInstallComplete] = useState<boolean>();

  const onClickDownloadAndInstall = async () => {
    setHasStartedDownload(true);
    const installResult = await electron.installDocker();
    if (installResult && !installResult.error) {
      setInstallComplete(true);
      // notify parent that everything is done
      // todo: confirm/check docker version installed?
    }
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

  const listenForNodeLogs = useCallback(async () => {
    electron.ipcRenderer.on('docker', nodeLogsListener);
  }, []);

  useEffect(() => {
    console.log('DockerInstallation.tsx: isOpen. Listening for logs.');
    listenForNodeLogs();
    return () => electron.ipcRenderer.removeAllListeners('docker');
  }, [listenForNodeLogs]);

  // listen to docker install messages
  return (
    <div className={container}>
      <div className={titleFont}>{t('DockerInstallation')}</div>
      <div className={descriptionFont}>
        <>{t('dockerPurpose')}</>
      </div>
      <ExternalLink
        text={t('LearnMoreDocker')}
        url="https://www.docker.com/products/docker-desktop/"
      />
      {!sDownloadComplete && !sInstallComplete && (
        <>
          {!sHasStartedDownload ? (
            <div>
              <Button
                primary
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
      {sDownloadComplete && sInstallComplete && (
        <p>{t('DockerInstallComplete')}</p>
      )}
    </div>
  );
};

export default DockerInstallation;
