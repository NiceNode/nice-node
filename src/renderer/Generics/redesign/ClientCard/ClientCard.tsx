import { NodeIconId } from '../../../assets/images/nodeIcons';
import {
  NodeBackgroundId,
  NODE_BACKGROUNDS,
} from '../../../assets/images/nodeBackgrounds';
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
import { Label } from '../Label/Label';
import ProgressBar from '../ProgressBar/ProgressBar';
import { ClientStatusProps } from '../consts';

const getLabelDetails = (label: string) => {
  const labelDetails = { color: '', string: '' };
  switch (label) {
    case 'synchronized':
      labelDetails.color = 'green';
      labelDetails.string = 'Synchronized';
      break;
    case 'lowPeerCount':
      labelDetails.color = 'orange';
      labelDetails.string = 'Low peer count';
      break;
    case 'updateAvailable':
      labelDetails.color = 'purple';
      labelDetails.string = 'Update Available';
      break;
    case 'stopped':
      labelDetails.color = 'purple';
      labelDetails.string = 'Update';
      break;
    default:
      break;
  }
  return labelDetails;
};

export interface ClientCardProps {
  /**
   * Node client object
   */
  client: {
    name: NodeBackgroundId;
    version: string;
    nodeType: string;
    status: ClientStatusProps;
    stats: {
      peers: number;
      slot: string;
      cpuLoad: number;
      diskUsage: number;
    };
  };
}

/**
 * Primary UI component for user interaction
 */
export const ClientCard = ({ client }: ClientCardProps) => {
  const { status, name, nodeType } = client;
  const isNotSynchronizedAndStopped = !status.synchronized && !status.stopped;
  const renderContents = () => {
    if (isNotSynchronizedAndStopped) {
      return (
        <>
          {/* TODO: tie clients with progress bar colors */}
          {/* TODO: modify height of the bar for card */}
          <ProgressBar
            card
            color="#F96767"
            progress={23}
            caption="Initial sync in progress."
          />
        </>
      );
    }
    if (status.stopped) {
      return <Label type="gray" label="Stopped" />;
    }
    const statusKeys = Object.keys(status).filter(
      (k: string) => status[k] === true
    );
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
          height: isNotSynchronizedAndStopped ? 166 : 186,
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
