import { useTranslation } from 'react-i18next';

import { updateSelectedNodeId } from '../state/node';
import { NodeSpecification } from '../../common/nodeSpec';
import electron from '../electronGlobal';
import { Modal } from '../Modal';
import { useAppDispatch } from '../state/hooks';

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  // eslint-disable-next-line react/require-default-props
  nodeSpec?: NodeSpecification;
};

const ConfirmAddNode = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isOpen, onConfirm, onCancel, nodeSpec } = props;
  if (!nodeSpec) {
    return <></>;
  }

  const onConfirmAddSpecificNode = async () => {
    const node = await electron.addNode(nodeSpec);

    console.log('addNode returned node: ', node);
    dispatch(updateSelectedNodeId(node.id));
    onConfirm();
  };

  const { iconUrl, displayName, category } = nodeSpec;
  return (
    <Modal
      isOpen={isOpen}
      title={`${t('Add Node')} ${displayName}`}
      onClickCloseButton={onCancel}
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 20 }}
      >
        {displayName}
        <div style={{ height: 80 }}>
          <img src={iconUrl} alt={displayName} style={{ height: 80 }} />
        </div>
        {category}
      </div>
      <div>{t('nodeNotStartedYet')}</div>
      <div>
        <button type="button" onClick={onConfirmAddSpecificNode}>
          <span>{t('Confirm')}</span>
        </button>
        &nbsp;
        <button type="button" onClick={onCancel}>
          <span>{t('Cancel')}</span>
        </button>
      </div>
    </Modal>
  );
};
export default ConfirmAddNode;
