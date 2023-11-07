import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '../../Generics/redesign/Icon/Icon';
import {
  captionText,
  container,
  descriptionFont,
  titleFont,
  learnMore,
  installContentContainer,
  installationContainer,
  installationIcon,
  installationComplete,
  installationSteps,
} from './podmanInstallation.css';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import electron from '../../electronGlobal';
import Button from '../../Generics/redesign/Button/Button';
import ProgressBar from '../../Generics/redesign/ProgressBar/ProgressBar';
import { FileDownloadProgress } from '../../../main/downloadFile';
import { bytesToMB } from '../../utils';
import TimedProgressBar from '../../Generics/redesign/ProgressBar/TimedProgressBar';
import {
  useGetIsPodmanInstalledQuery,
  useGetIsPodmanRunningQuery,
  useGetPodmanDetailsQuery,
} from '../../state/settingsService';
// import { reportEvent } from '../../events/reportEvent';
import { CHANNELS } from '../../../main/messenger';
import { IpcMessage } from '../../../main/podman/messageFrontEnd';
import { Message } from '../../Generics/redesign/Message/Message';
import { arePodmanRequirementsMet } from '../AddNodeStepper/podmanRequirements';

// 6.5(docker), ? min on 2022 MacbookPro 16inch, baseline
const TOTAL_INSTALL_TIME_SEC = 5 * 60;
export interface PodmanInstallationProps {
  /**
   * Listen to node config changes
   */
  onChange: (newValue: string) => void;
  disableSaveButton?: (newValue: boolean) => void;
  type?: string;
}

const PodmanInstallation = ({
  onChange,
  disableSaveButton,
  type = '',
}: PodmanInstallationProps) => {
  const { t } = useTranslation();
  const qIsPodmanInstalled = useGetIsPodmanInstalledQuery();
  const isPodmanInstalled = qIsPodmanInstalled?.data;
  const qIsPodmanRunning = useGetIsPodmanRunningQuery(null, {
    pollingInterval: 15000,
  });
  const isPodmanRunning = qIsPodmanRunning?.data;
  const qPodmanDetails = useGetPodmanDetailsQuery(null, {
    pollingInterval: 15000,
  });
  const podmanDetails = qPodmanDetails?.data;
  const [sHasStartedDownload, setHasStartedDownload] = useState<boolean>();
  const [sDownloadComplete, setDownloadComplete] = useState<boolean>();
  const [sDownloadProgress, setDownloadProgress] = useState<number>(0);
  const [sTotalSizeBytes, setTotalSizeBytes] = useState<number>(0);
  const [sDownloadedBytes, setDownloadedBytes] = useState<number>(0);
  const [
    sDidUserGrantPermissionToInstallPodman,
    setDidUserGrantPermissionToInstallPodman,
  ] = useState<boolean>();
  const [sInstallComplete, setInstallComplete] = useState<boolean>();

  useEffect(() => {
    // todoo
    if (disableSaveButton) disableSaveButton(true);
    // if (disableSaveButton) disableSaveButton(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('isPodmanRunning: ', isPodmanRunning);

  useEffect(() => {
    // wait until podman is running and not outdated before confirming 'done'
    if (arePodmanRequirementsMet(podmanDetails)) {
      onChange('done');
    }
  }, [isPodmanRunning, podmanDetails, onChange]);

  const onClickDownloadAndInstall = async () => {
    setHasStartedDownload(true);
    if (navigator.userAgent.indexOf('Linux') !== -1) {
      setDownloadComplete(true);
    }
    const installResult = await electron.installPodman();
    qIsPodmanInstalled.refetch();
    qIsPodmanRunning.refetch();
    if (installResult && !installResult.error) {
      setInstallComplete(true);
      // reportEvent('InstalledPodman');
      // notify parent that everything is done
      // todo: confirm/check podman version installed?
    }
    console.log('installPodman finished. Install result: ', installResult);
  };

  const onClickStartPodman = async () => {
    setHasStartedDownload(true);
    const startResult = await electron.startPodman();
    qIsPodmanRunning.refetch();
    console.log('startPodman finished. Start result: ', startResult);
  };

  const onClickUpdatePodman = async () => {
    setHasStartedDownload(true);
    if (navigator.userAgent.indexOf('Linux') !== -1) {
      setDownloadComplete(true);
    }
    const updateResult = await electron.updatePodman();
    // todo: consolodate these to just use qPodmanDetails
    qIsPodmanInstalled.refetch();
    qIsPodmanRunning.refetch();
    qPodmanDetails.refetch();
    if (updateResult && !updateResult.error) {
      setInstallComplete(true);
    }
    console.log('updatePodman finished. Start result: ', updateResult);
  };

  const podmanMessageListener = (message: FileDownloadProgress[]) => {
    // set totalSize & progress
    if (message[0]) {
      console.log('downloadupdate: ', message[0]);
      setTotalSizeBytes(message[0].totalBytes);
      setDownloadedBytes(message[0].downloadedBytes);
      setDownloadProgress(
        (message[0].downloadedBytes / message[0].totalBytes) * 100,
      );
      // if downloaded = total, then complete?
      if (message[0].downloadedBytes === message[0].totalBytes) {
        console.log('downloaded = total bytes. download complete');
        setDownloadComplete(true);
      }
    } else {
      console.error('recieved empty podman message');
    }
  };

  const podmanInstallMessageListener = useCallback(
    (messageArray: [IpcMessage]) => {
      // set totalSize & progress
      const message = messageArray[0];
      console.log('podmanInstallMessageListener message: ', message);
      if (message.messageId === 'isGrantPermission') {
        console.log('message: ', message);
        // if false, notify user that podman is required and allow them another try
        //  to grant permissions
        setDidUserGrantPermissionToInstallPodman(message?.value as boolean);
      } else {
        // ignore for now?
      }
    },
    [],
  );

  useEffect(() => {
    // if granted, start install & countdown
    // if not granted, show warning
  }, [sDidUserGrantPermissionToInstallPodman]);

  useEffect(() => {
    console.log('PodmanInstallation.tsx: listenForPodmanInstallUpdates .');
    electron.ipcRenderer.on(CHANNELS.podman, podmanMessageListener);
    electron.ipcRenderer.on(
      CHANNELS.podmanInstall,
      podmanInstallMessageListener,
    );
    return () => {
      electron.ipcRenderer.removeAllListeners(CHANNELS.podman);
      electron.ipcRenderer.removeListener(
        CHANNELS.podmanInstall,
        podmanInstallMessageListener,
      );
    };
  }, [podmanInstallMessageListener]);

  // useEffect(() => {
  //   return () => {
  //     qIsPodmanRunning.unsubscribe();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  console.log('isPodmanInstalled', isPodmanInstalled);
  console.log('podmanDetails', podmanDetails);

  // listen to podman install messages
  return (
    <div className={[container, type].join(' ')}>
      {type !== 'modal' && (
        <div className={titleFont}>{t('PodmanInstallation')}</div>
      )}
      <div className={descriptionFont}>
        <>{t('podmanPurpose')}</>
      </div>
      <div className={learnMore}>
        <ExternalLink text={t('LearnMorePodman')} url="https://podman.io/" />
      </div>
      {/* Podman is not installed */}
      <div className={installContentContainer}>
        {podmanDetails?.isOutdated && (
          <div style={{ marginBottom: 32 }}>
            <Message
              description={t('PodmanUpdateRequiredDescription')}
              title={t('Podman update required')}
              type="info"
            />
          </div>
        )}
        {(!isPodmanInstalled || podmanDetails?.isOutdated) && (
          <>
            {!sDownloadComplete && !sInstallComplete && (
              <>
                {!sHasStartedDownload ? (
                  <div>
                    <Button
                      type="primary"
                      label={t('DownloadAndInstall')}
                      onClick={() => {
                        if (isPodmanInstalled && podmanDetails?.isOutdated) {
                          onClickUpdatePodman();
                        } else {
                          onClickDownloadAndInstall();
                        }
                      }}
                    />
                    <div className={captionText}>~100MB {t('download')}</div>
                  </div>
                ) : (
                  <ProgressBar
                    progress={sDownloadProgress}
                    title={t('DownloadingPodman')}
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
                title={t('InstallingPodman')}
              />
            )}
          </>
        )}

        {sDownloadComplete && sInstallComplete && (
          <div className={installationContainer}>
            <div className={installationIcon}>
              <Icon iconId="checkcirclefilled" />
            </div>
            <div className={installationComplete}>
              {t('PodmanInstallComplete')}
            </div>
            <div className={installationSteps}>
              {t('PodmanIsInstalled')}{' '}
              {!isPodmanRunning ? t('StartPodman') : t('StartNode')}
            </div>
          </div>
        )}
        {/* Podman is installed but not running */}
        {isPodmanInstalled && !isPodmanRunning && (
          <>
            <Button
              type="primary"
              label={t('StartPodman')}
              onClick={onClickStartPodman}
            />
          </>
        )}
        {sDidUserGrantPermissionToInstallPodman === false && (
          <p>{t('PodmanIsRequired')}</p>
        )}
      </div>
    </div>
  );
};

export default PodmanInstallation;
