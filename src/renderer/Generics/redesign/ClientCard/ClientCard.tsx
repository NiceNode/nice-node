import { useTranslation } from 'react-i18next';
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

/**
 * Primary UI component for user interaction
 */
export const ClientCard = (props: ClientProps) => {
  const { status, name, nodeType, stats } = props;

  const { t: g } = useTranslation('genericComponents');

  const getLabelDetails = (label: string) => {
    const labelDetails: { color: LabelColor; string: string } = {
      color: 'gray',
      string: '',
    };
    switch (label) {
      case 'synchronized':
        labelDetails.color = 'green';
        labelDetails.string = g('Synchronized');
        break;
      case 'blocksBehind':
        labelDetails.color = 'orange';
        labelDetails.string = g('BlocksBehind');
        break;
      case 'lowPeerCount':
        labelDetails.color = 'orange';
        labelDetails.string = g('LowPeerCount');
        break;
      case 'noConnection':
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
        ? g('InitialSyncInProgress')
        : g('CatchingUp');
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
      const label = status.stopped ? g('Stopped') : g('Updating');
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
    nodeType === 'execution' ? g('ExecutionClient') : g('ConsensusClient');

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
