import { useState } from 'react';
import { SelectTranslation } from 'common/nodeConfig';
import SyncMode from './SyncMode';
import { syncModeContainer } from './syncModes.css';

export interface SyncModesProps {
  controlTranslations: SelectTranslation[];
  onChange: (newValue: string) => void;
  isDisabled?: boolean;
}

const SyncModes = ({
  controlTranslations,
  onChange,
  isDisabled,
}: SyncModesProps) => {
  const [selectedMode, setSelectedMode] = useState(
    controlTranslations[0].value,
  );

  const handleModeChange = (newValue: string) => {
    if (!isDisabled) {
      setSelectedMode(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className={syncModeContainer}>
      {controlTranslations.map((translation, index) => (
        <SyncMode
          key={translation.value}
          value={translation.value}
          info={translation.info}
          isSelected={selectedMode === translation.value}
          onClick={handleModeChange}
          index={index}
        />
      ))}
    </div>
  );
};

export default SyncModes;
