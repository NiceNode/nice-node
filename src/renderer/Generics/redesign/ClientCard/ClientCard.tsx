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
} from './clientCard.css';
import { NodeIcon } from '../NodeIcon/NodeIcon';
import { Label } from '../Label/Label';

export interface ClientCardProps {
  /**
   * Node name
   */
  name: NodeBackgroundId;
  /**
   * Is it syncing?
   */
  sync: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const ClientCard = ({ name, sync }: ClientCardProps) => {
  const renderContents = () => {
    if (sync) {
      return (
        <>
          <div />
        </>
      );
    }
    return (
      <div className={clientLabels}>
        {/* TODO: tie labels and colors */}
        <Label type="purple" label="Update" />
        <Label type="orange" label="Low peer count" />
        <Label type="green" label="Synchronized" />
      </div>
    );
  };
  return (
    <div className={container}>
      <div
        style={{
          backgroundImage: `url(${NODE_BACKGROUNDS[name]})`,
          height: sync ? 166 : 186,
        }}
        className={cardTop}
      >
        <div className={clientDetails}>
          <div className={clientIcon}>
            <NodeIcon iconId={name} size="medium" />
          </div>
          <div className={clientTitle}>{name}</div>
        </div>
      </div>
      <div className={cardContent}>
        <div className={clientType}>Consensus Client</div>
        {renderContents()}
      </div>
    </div>
  );
};
