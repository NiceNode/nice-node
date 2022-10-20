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
  const labelObject = { color: '', string: '' };
  switch (label) {
    case 'synchronized':
      labelObject.color = 'green';
      labelObject.string = 'Synchronized';
      break;
    case 'lowPeerCount':
      labelObject.color = 'orange';
      labelObject.string = 'Low peer count';
      break;
    case 'update':
      labelObject.color = 'purple';
      labelObject.string = 'Update';
      break;
    case 'stopped':
      labelObject.color = 'purple';
      labelObject.string = 'Update';
      break;
    default:
      break;
  }
  return labelObject;
};

export interface ClientCardProps {
  /**
   * Node item object
   */
  item: {
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
  };
}

/**
 * Primary UI component for user interaction
 */
export const ClientCard = ({ item }: ClientCardProps) => {
  const { status, name, type } = item;
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
          const label = getLabelDetails(key);
          return <Label type={label.color} label={label.string} />;
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
