import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NodePackage } from '../../../common/node';
import { ModalConfig } from '../ModalManager/modalUtils';
import { Checkbox } from '../../Generics/redesign/Checkbox/Checkbox';
import { container, removeText } from './removeNode.css';

export interface RemoveNodeProps {
  nodeStorageUsedGBs?: number;
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
  selectedNodePackage?: NodePackage;
}

const RemoveNode = ({
  nodeStorageUsedGBs,
  modalOnChangeConfig,
  selectedNodePackage,
}: RemoveNodeProps) => {
  const [sNodeStorageMessage, setNodeStorageMessage] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    if (nodeStorageUsedGBs) {
      setNodeStorageMessage(`(${nodeStorageUsedGBs.toFixed(1)}GB)`);
    } else {
      setNodeStorageMessage(t('CalculatingDataSize'));
    }
  }, [nodeStorageUsedGBs, t]);

  return (
    <div className={container}>
      <p className={removeText}>{t('AllSettingsDataRemoved')}</p>
      <p className={removeText}>{t('OptionallyKeepData')}</p>
      <Checkbox
        label={t('KeepNodeData', { data: sNodeStorageMessage })}
        onClick={(isChecked: boolean) => {
          modalOnChangeConfig({
            isDeleteStorage: !isChecked,
            selectedNodePackage,
          });
        }}
      />
    </div>
  );
};

export default RemoveNode;
