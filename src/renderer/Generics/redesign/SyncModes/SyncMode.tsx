import {
  container,
  activeContainer,
  selectedContainer,
  syncModeButton,
  syncModeTitle,
  syncModeDetails,
  syncModeInfo,
} from './syncModes.css';
import syncMode1 from '../../../assets/images/syncModes/syncMode1.svg';
import syncMode2 from '../../../assets/images/syncModes/syncMode2.svg';
import syncMode3 from '../../../assets/images/syncModes/syncMode3.svg';

export interface SyncModeProps {
  value: string;
  onClick: (newValue: string) => void;
  isSelected?: boolean;
  index?: number;
}

const SyncMode = ({ value, onClick, isSelected, index }: SyncModeProps) => {
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
      role="button"
      tabIndex={0}
    >
      <div className={containerStyles.join(' ')}>
        <div>
          <img alt="Alpha build" src={syncImage} />
        </div>
        <div className={syncModeInfo}>
          <div className={syncModeTitle}>{value}</div>
          <div className={syncModeDetails}>~25GB / 2h sync</div>
        </div>
      </div>
    </div>
  );
};

export default SyncMode;
