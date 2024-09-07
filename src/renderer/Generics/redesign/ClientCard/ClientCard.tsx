import { useTranslation } from 'react-i18next';
import {
  NODE_BACKGROUNDS,
  type NodeBackgroundId,
} from '../../../assets/images/nodeBackgrounds';
import { Label, type LabelColor } from '../Label/Label';
import NodeIcon from '../NodeIcon/NodeIcon';
import ProgressBar from '../ProgressBar/ProgressBar';
// import ProgressBar from '../ProgressBar/ProgressBar';
import type { ClientProps, ClientStatusProps } from '../consts';
// import { common } from '../theme.css';
import { SYNC_STATUS } from '../consts.js';
import { common } from '../theme.css';
import {
  cardContent,
  cardTop,
  clientBackground,
  clientDetails,
  clientIcon,
  clientLabels,
  clientTitle,
  clientType,
  container,
} from './clientCard.css';

/**
 * Primary UI component for user interaction
 */
export const ClientCard = (props: ClientProps) => {
  const {
    displayName,
    packageName,
    status,
    name,
    nodeType,
    onClick,
    stats,
    iconUrl,
    single,
  } = props;

  const { t: g } = useTranslation('genericComponents');

  const getLabelDetails = (label: string) => {
    const labelDetails: { color: LabelColor; string: string } = {
      color: 'gray',
      string: '',
    };
    switch (label) {
      case SYNC_STATUS.SYNCHRONIZED:
        labelDetails.color = 'green';
        labelDetails.string = g('Synchronized');
        break;
      case SYNC_STATUS.BLOCKS_BEHIND:
        labelDetails.color = 'orange';
        labelDetails.string = g('BlocksBehind');
        break;
      case SYNC_STATUS.LOW_PEER_COUNT:
        labelDetails.color = 'orange';
        labelDetails.string = g('LowPeerCount');
        break;
      case SYNC_STATUS.NO_CONNECTION:
        labelDetails.color = 'red';
        labelDetails.string = g('NoConnection');
        break;
      case 'updateAvailable':
        labelDetails.color = 'purple';
        labelDetails.string = g('UpdateAvailable');
        break;
      default:
        break;
    }
    return labelDetails;
  };

  // const isNotCloseToSynchronized =
  //   (stats.highestSlot &&
  //     stats.currentSlot &&
  //     stats.highestSlot - stats.currentSlot > 10) ||
  //   (stats.highestBlock &&
  //     stats.currentBlock &&
  //     stats.highestBlock - stats.currentBlock > 10);

  const renderContents = () => {
    if (
      status.stopped ||
      status.updating ||
      status.stopping ||
      status.starting ||
      status.removing
    ) {
      let label;
      switch (true) {
        case status.removing:
          label = g('Removing');
          break;
        case status.stopped:
          label = g('Stopped');
          break;
        case status.updating:
          label = g('Updating');
          break;
        case status.stopping:
          label = g('Stopping');
          break;
        case status.starting:
          label = g('Starting');
          break;
        default:
          label = '';
      }
      return <Label type="gray" label={label} />;
    }
    const { updating, running, error, ...statusLabels } = status;
    const statusKeys = Object.keys(statusLabels).filter((k: string) => {
      const statusKey = k as keyof ClientStatusProps;
      return status[statusKey] === true;
    });

    // Helper function to calculate progress
    const calculateProgress = () => {
      let progress = 0;
      if (stats.highestSlot && stats.currentSlot) {
        progress = stats.currentSlot / stats.highestSlot;
      } else if (stats.highestBlock && stats.currentBlock) {
        progress = stats.currentBlock / stats.highestBlock;
      }
      return progress * 100;
    };

    return (
      <>
        {statusKeys.length > 0 && (
          <div className={clientLabels}>
            {statusKeys.map((key) => {
              const labelDetails = getLabelDetails(key);
              return (
                <Label
                  key={key}
                  type={labelDetails.color}
                  label={labelDetails.string}
                />
              );
            })}
          </div>
        )}
        {!status.noConnection &&
          !status.synchronized &&
          (stats.currentBlock !== 0 || stats.currentSlot !== 0) && (
            <ProgressBar
              card
              color={
                common.color[name.replace('-beacon', '') as NodeBackgroundId] ??
                common.color.geth
              }
              progress={calculateProgress()}
              showPercent
              caption={
                !status.catchingUp
                  ? g('InitialSyncInProgress')
                  : g('CatchingUp')
              }
              outerStyle={{ height: '20px' }}
              innerStyle={{ height: '20px' }}
            />
          )}
      </>
    );
  };

  const calculateCardHeight = () => {
    if (
      status.stopped ||
      status.updating ||
      status.stopping ||
      status.starting ||
      status.removing
    ) {
      return 186; // Height for single label states
    }

    const showSyncProgress =
      !status.noConnection &&
      !status.synchronized &&
      (stats.currentBlock !== 0 || stats.currentSlot !== 0);

    const hasStatusLabels = Object.keys(status).some(
      (key) =>
        key !== 'updating' &&
        key !== 'running' &&
        key !== 'error' &&
        status[key as keyof ClientStatusProps],
    );

    if (showSyncProgress && hasStatusLabels) {
      return 132; // Height when both sync progress and labels are shown
    }

    if (
      (status.running && !status.synchronized) ||
      (status.error && !status.noConnection)
    ) {
      return 166; // Original condition for 166px height
    }

    return 186; // Default height
  };

  const stoppedStyle = status.stopped ? 'stopped' : '';
  return (
    <div
      className={container}
      style={{ width: single ? '100%' : '50%' }}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      onKeyDown={() => {
        if (onClick) {
          onClick();
        }
      }}
      role="presentation"
    >
      <div
        style={{
          backgroundImage: `url(${
            NODE_BACKGROUNDS[name.replace('-beacon', '') as NodeBackgroundId] ??
            NODE_BACKGROUNDS.nimbus
          })`,
          height: calculateCardHeight(),
        }}
        className={[cardTop, `${stoppedStyle}`].join(' ')}
      >
        <div className={[clientBackground, `${stoppedStyle}`].join(' ')}>
          <div className={clientDetails}>
            <div className={clientIcon}>
              <NodeIcon
                iconId={name.replace('-beacon', '')}
                size="medium"
                iconUrl={iconUrl}
              />
            </div>
            <div className={clientTitle}>{displayName}</div>
          </div>
        </div>
      </div>
      <div className={cardContent}>
        <div className={clientType}>{nodeType}</div>
        {renderContents()}
      </div>
    </div>
  );
};
