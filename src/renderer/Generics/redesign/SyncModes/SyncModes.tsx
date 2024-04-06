import { useState, useEffect } from 'react';
import { SelectTranslation } from '../../../../common/nodeConfig';
import SyncMode from './SyncMode';
import { syncModeContainer } from './syncModes.css';

export interface SyncModesProps {
  value?: string;
  controlTranslations: SelectTranslation[];
  onChange: (newValue: string) => void;
  disabled?: boolean;
}

const SyncModes = ({
  value,
  controlTranslations,
  onChange,
  disabled,
}: SyncModesProps) => {
  const [selectedMode, setSelectedMode] = useState('');

  useEffect(() => {
    setSelectedMode(value || controlTranslations[0].value);
  }, [value, controlTranslations]);

  const handleModeChange = (newValue: string) => {
    if (!disabled) {
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
