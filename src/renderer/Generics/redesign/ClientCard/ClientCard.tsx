import { NODE_BACKGROUNDS } from '../../../assets/images/nodeBackgrounds';
import {
  container,
  cardTop,
  cardContent,
  clientDetails,
  clientIcon,
  clientTitle,
  clientType,
  clientLabels,
  clientBackground,
} from './clientCard.css';
import { NodeIcon } from '../NodeIcon/NodeIcon';
import { Label, LabelColor } from '../Label/Label';
import ProgressBar from '../ProgressBar/ProgressBar';
import { ClientProps, ClientStatusProps } from '../consts';
import { common } from '../theme.css';

const getLabelDetails = (label: string) => {
  const labelDetails: { color: LabelColor; string: string } = {
    color: 'gray',
    string: '',
  };
  switch (label) {
    case 'synchronized':
      labelDetails.color = 'green';
      labelDetails.string = 'Synchronized';
      break;
    case 'blocksBehind':
      labelDetails.color = 'orange';
      labelDetails.string = 'Blocks Behind';
      break;
    case 'lowPeerCount':
      labelDetails.color = 'orange';
      labelDetails.string = 'Low peer count';
      break;
    case 'noConnection':
      labelDetails.color = 'red';
      labelDetails.string = 'No connection';
      break;
    case 'updateAvailable':
      labelDetails.color = 'purple';
      labelDetails.string = 'Update Available';
      break;
    default:
      break;
  }
  return labelDetails;
};

/**
 * Primary UI component for user interaction
 */
export const ClientCard = (props: ClientProps) => {
  const { status, name, nodeType, stats } = props;
  const isNotCloseToSynchronized =
    (stats.highestSlot &&
      stats.currentSlot &&
      stats.highestSlot - stats.currentSlot > 10) ||
    (stats.highestBlock &&
      stats.currentBlock &&
      stats.highestBlock - stats.currentBlock > 10);
  const isNotSynchronizedAndNotStopped =
    isNotCloseToSynchronized && !status.stopped;

  const renderContents = () => {
    if (isNotSynchronizedAndNotStopped) {
      const caption = !status.initialized
        ? 'Initial sync in progress.'
        : 'Catching up';
      let progress;
      if (stats.highestSlot && stats.currentSlot) {
        progress = (stats.currentSlot / stats.highestSlot) * 100;
      } else if (stats.highestBlock && stats.currentBlock) {
        progress = (stats.currentBlock / stats.highestBlock) * 100;
      }
      return (
        <>
          {/* TODO: modify height of the bar for card */}
          <ProgressBar
            card
            color={common.color[name]}
            progress={progress}
            caption={caption}
          />
        </>
      );
    }
    if (status.stopped || status.updating) {
      const label = status.stopped ? 'Stopped' : 'Updating...';
      return <Label type="gray" label={label} />;
    }
    const { updating, initialized, ...statusLabels } = status;
    const statusKeys = Object.keys(statusLabels).filter((k: string) => {
      const statusKey = k as keyof ClientStatusProps;
      return status[statusKey] === true;
    });
    return (
      <div className={clientLabels}>
        {statusKeys.map((key) => {
          const labelDetails = getLabelDetails(key);
          return (
            <Label type={labelDetails.color} label={labelDetails.string} />
          );
        })}
      </div>
    );
  };

  // TODO: refactor this out since it's used in Single client view
  const clientTypeLabel =
    nodeType === 'execution' ? 'Execution Client' : 'Consensus Client';

  const stoppedStyle = status.stopped ? 'stopped' : '';
  return (
    <div className={container}>
      <div
        style={{
          backgroundImage: `url(${NODE_BACKGROUNDS[name]})`,
          height: isNotSynchronizedAndNotStopped ? 166 : 186,
        }}
        className={[cardTop, `${stoppedStyle}`].join(' ')}
      >
        <div className={[clientBackground, `${stoppedStyle}`].join(' ')}>
          <div className={clientDetails}>
            <div className={clientIcon}>
              <NodeIcon iconId={name} size="medium" />
            </div>
            <div className={clientTitle}>{name}</div>
          </div>
        </div>
      </div>
      <div className={cardContent}>
        <div className={clientType}>{clientTypeLabel}</div>
        {renderContents()}
      </div>
    </div>
  );
};
