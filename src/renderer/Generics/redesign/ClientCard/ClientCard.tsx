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
    case 'update':
      labelDetails.color = 'purple';
      labelDetails.string = 'Update';
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
    type: string;
    status: {
      synchronized: boolean;
      lowPeerCount: boolean;
      updateAvailable: boolean;
      stopped: boolean;
      blocksBehind: boolean;
      noConnection: boolean;
    };
    stats: {
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
  const { status, name, type } = client;
  const renderContents = () => {
    if (!status.synchronized) {
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
    const statusKeys = Object.keys(status).filter((k) => status[k]);
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

  // TODO: better const name
  const typeClientName =
    type === 'execution' ? 'Execution Client' : 'Consensus Client';

  return (
    <div className={container}>
      <div
        style={{
          backgroundImage: `url(${NODE_BACKGROUNDS[name]})`,
          height: !status.synchronized ? 166 : 186,
        }}
        className={cardTop}
      >
        <div className={clientBackground}>
          <div className={clientDetails}>
            <div className={clientIcon}>
              <NodeIcon iconId={name} size="medium" />
            </div>
            <div className={clientTitle}>{name}</div>
          </div>
        </div>
      </div>
      <div className={cardContent}>
        <div className={clientType}>{typeClientName}</div>
        {renderContents()}
      </div>
    </div>
  );
};
