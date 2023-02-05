import { useCallback, useEffect, useState } from 'react';
import { t } from 'i18next';
import { actionButtonsContainer } from '../../Generics/redesign/Alert/alert.css';
import Button from '../../Generics/redesign/Button/Button';
import { Message } from '../../Generics/redesign/Message/Message';
import { Checkbox } from '../../Generics/redesign/Checkbox/Checkbox';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference = 'theme' | 'isOpenOnStartup';
export interface RemoveNodeProps {
  onClickClose: () => void;
  nodeDisplayName?: string;
  nodeStorageUsedGBs?: number;
  onClickRemoveNode: (isDeletingData: boolean) => void;
  errorMessage?: string;
}

const RemoveNode = ({
  onClickClose,
  nodeDisplayName,
  nodeStorageUsedGBs,
  onClickRemoveNode,
  errorMessage,
}: RemoveNodeProps) => {
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
  );
};

export default RemoveNode;
