import syncMode1 from '../../../assets/images/syncModes/syncMode1.svg';
import syncMode2 from '../../../assets/images/syncModes/syncMode2.svg';
import syncMode3 from '../../../assets/images/syncModes/syncMode3.svg';
import {
  activeContainer,
  container,
  selectedContainer,
  syncModeButton,
  syncModeDetails,
  syncModeInfo,
  syncModeTitle,
} from './syncModes.css';

export interface SyncModeProps {
  value: string;
  onClick: (newValue: string) => void;
  isSelected?: boolean;
  index?: number;
  info?: string;
}

const SyncMode = ({
  value,
  info,
  onClick,
  isSelected,
  index,
}: SyncModeProps) => {
  const containerStyles = [container];
  if (isSelected) {
    containerStyles.push(selectedContainer);
  }

  let syncImage = syncMode1;
  switch (index) {
    case 0:
      syncImage = syncMode1;
      break;
    case 1:
      syncImage = syncMode2;
      break;
    case 2:
      syncImage = syncMode3;
      break;
    default:
      syncImage = syncMode1;
  }

  return (
    <div
      className={[activeContainer, syncModeButton].join(' ')}
      onClick={() => onClick(value)}
      onBlur={() => {
        // setSelected(false);
      }}
      onKeyDown={() => onClick(value)}
      // biome-ignore lint: useSemanticElements
      role="button"
      tabIndex={0}
    >
      <div className={containerStyles.join(' ')}>
        <div>
          <img alt="sync" src={syncImage} />
        </div>
        <div className={syncModeInfo}>
          <div className={syncModeTitle}>{value}</div>
          <div className={syncModeDetails}>{info}</div>
        </div>
      </div>
    </div>
  );
};

export default SyncMode;
