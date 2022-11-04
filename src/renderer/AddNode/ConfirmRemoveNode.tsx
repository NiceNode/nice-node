import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import electron from '../electronGlobal';
import { Modal } from '../Generics/redesign/Modal/Modal';
import Node from '../../common/node';

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  // eslint-disable-next-line react/require-default-props
  node?: Node;
};

const RemoveNode = (props: Props) => {
  const { t } = useTranslation();
  const [sShouldDeleteNodeStorage, setShouldDeleteNodeStorage] =
    useState<boolean>(false);
  const [sError, setError] = useState<string>('');

  const { isOpen, onConfirm, onCancel, node } = props;
  if (!node) {
    return <></>;
  }

  const onConfirmRemoveNode = async () => {
    try {
      setError('');
      await electron.removeNode(node.id, {
        isDeleteStorage: sShouldDeleteNodeStorage,
      });
      onConfirm();
    } catch (err) {
      console.error(err);
      setError('Error removing the node.');
    }
  };

  const nodeSpec = node.spec;
  const { iconUrl, displayName, category } = nodeSpec;
  return (
    <Modal
      isOpen={isOpen}
      title={`${t('Remove')} ${displayName}?`}
      onClickCloseButton={onCancel}
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 20 }}
      >
        <div style={{ height: 80 }}>
          <img src={iconUrl} alt={displayName} style={{ height: 80 }} />
        </div>
        {category}
      </div>
      <h2>
        Removing a node will stop the node, remove it from your nodes, and
        custom settings for the node will be removed.
      </h2>
      <h2>
        <MdDelete />
        Delete node data?
      </h2>
      <h3>
        Node data storage size:{' '}
        {node?.runtime?.usage?.diskGBs &&
          `${(node?.runtime?.usage?.diskGBs).toFixed(1)}GB`}
      </h3>
      <p>
        Your node requires this data to run and will require time and internet
        data to recover if deleted. Only delete node data if you do not intend
        to run this node.
      </p>
      <div style={{ marginBottom: 40 }}>
        <form>
          <label htmlFor="shouldCheckForUpdates">
            <input
              id="shouldCheckForUpdates"
              type="checkbox"
              name="shouldCheckForUpdates"
              checked={sShouldDeleteNodeStorage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setShouldDeleteNodeStorage(e.target.checked)
              }
            />
            Delete node data?
          </label>
        </form>
      </div>
      {sError}
      <div
        style={{ margin: 5, display: 'flex', justifyContent: 'space-between' }}
      >
        <button type="button" onClick={onConfirmRemoveNode}>
          <span>
            {t('Confirm')} {sShouldDeleteNodeStorage ? 'and delete data' : ''}
          </span>
        </button>
        &nbsp;
        <button type="button" onClick={onCancel}>
          <span>{t('Cancel')}</span>
        </button>
      </div>
    </Modal>
  );
};
export default RemoveNode;
