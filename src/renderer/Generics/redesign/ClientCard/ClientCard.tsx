import { NodeIconId } from '../../../assets/images/nodeIcons';
import {
  NodeBackgroundId,
  NODE_BACKGROUNDS,
} from '../../../assets/images/nodeBackgrounds';
import { Icon } from '../Icon/Icon';
import {
  container,
  cardTop,
  cardContent,
  clientDetails,
  clientIcon,
  clientTitle,
} from './clientCard.css';
import { NodeIcon } from '../NodeIcon/NodeIcon';

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
  const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const renderContents = () => {
    if (sync) {
      return <></>;
    }
    return <></>;
  };
  return (
    <div className={container}>
      <div className={cardTop}>
        <div className={clientDetails}>
          <div className={clientIcon}>
            <NodeIcon iconId={name} size="medium" />
          </div>
          <div className={clientTitle}>{capitalize(name)}</div>
        </div>
        <img
          src={NODE_BACKGROUNDS[name]}
          alt="Node background"
          width="348"
          height="166"
        />
      </div>
      <div className={cardContent}>{renderContents()}</div>
    </div>
  );
};
