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
import { ClientProps } from '../consts';
import { common } from '../theme.css';

const getLabelDetails = (label: string) => {
  const labelDetails = { color: '', string: '' };
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
  const { status, name, nodeType } = props;
  const isNotSynchronizedAndNotStopped =
    status.synchronizing < 98 && !status.stopped;
  const renderContents = () => {
    if (isNotSynchronizedAndNotStopped) {
      const caption = !status.initialized
        ? 'Initial sync in progress.'
        : 'Catching up';
      return (
        <>
          {/* TODO: modify height of the bar for card */}
          <ProgressBar
            card
            color={common.color[name]}
            progress={status.synchronizing}
            caption={caption}
          />
        </>
      );
    }
    if (status.stopped) {
      return <Label type="gray" label="Stopped" />;
    }
    const { initialized, synchronizing, ...statusLabels } = status;
    const statusKeys = Object.keys(statusLabels).filter(
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
