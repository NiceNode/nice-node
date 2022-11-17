import { useTranslation } from 'react-i18next';

import { useCallback, useEffect, useState } from 'react';
import { t } from 'i18next';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { actionButtonsContainer } from '../../Generics/redesign/Alert/alert.css';
import Button from '../../Generics/redesign/Button/Button';
import { Message } from '../../Generics/redesign/Message/Message';
import { Checkbox } from '../../Generics/redesign/Checkbox/Checkbox';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference = 'theme' | 'isOpenOnStartup';
export interface RemoveNodeProps {
  isOpen: boolean;
  onClickClose: () => void;
  nodeDisplayName?: string;
  nodeStorageUsedGBs?: number;
  onClickRemoveNode: (isDeletingData: boolean) => void;
  errorMessage?: string;
}

const RemoveNode = ({
  isOpen,
  onClickClose,
  nodeDisplayName,
  nodeStorageUsedGBs,
  onClickRemoveNode,
  errorMessage,
}: RemoveNodeProps) => {
  const { t: tNiceNode } = useTranslation();
  const [sShouldDeleteNodeStorage, setShouldDeleteNodeStorage] =
    useState<boolean>(false);
  const [sNodeStorageMessage, setNodeStorageMessage] = useState<string>(
    'calculating data size...'
  );

  useEffect(() => {
    if (nodeStorageUsedGBs) {
      setNodeStorageMessage(`(${nodeStorageUsedGBs.toFixed(1)}GB)`);
    } else {
      setNodeStorageMessage('calculating data size...');
    }
  }, [nodeStorageUsedGBs]);

  const onClickRemove = useCallback(() => {
    onClickRemoveNode(sShouldDeleteNodeStorage);
  }, [onClickRemoveNode, sShouldDeleteNodeStorage]);

  return (
    <Modal
      isOpen={isOpen}
      title={`${tNiceNode('RemoveNode')}`}
      onClickCloseButton={onClickClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span>
          Are you sure you want to remove <strong>{nodeDisplayName}</strong>?
        </span>
        <Checkbox
          label={`${t('DeleteNodeDataQuestion')} ${sNodeStorageMessage}`}
          onClick={(isChecked: boolean) => {
            console.log('setShouldDeleteNodeStorage: ', isChecked);
            setShouldDeleteNodeStorage(isChecked);
          }}
        />
        {errorMessage && (
          <Message type="error" description={errorMessage} title="" />
        )}
        <div className={actionButtonsContainer}>
          <Button label={t('Cancel')} onClick={onClickClose} />
          <Button label={t('Remove')} type="danger" onClick={onClickRemove} />
        </div>
      </div>
    </Modal>
  );
};

export default RemoveNode;
