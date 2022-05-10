import { NodeSpecification } from '../../common/nodeSpec';
import electron from '../electronGlobal';
import { Modal } from '../Modal';

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  // eslint-disable-next-line react/require-default-props
  nodeSpec?: NodeSpecification;
};

const ConfirmAddNode = (props: Props) => {
  const { isOpen, onConfirm, onCancel, nodeSpec } = props;
  if (!nodeSpec) {
    return <></>;
  }

  const onConfirmAddSpecificNode = async () => {
    const node = await electron.addNode(nodeSpec);
    console.log('addNode returned node: ', node);
    onConfirm();
  };

  const { iconUrl, displayName, category } = nodeSpec;
  return (
    <Modal
      isOpen={isOpen}
      title={`Add ${displayName}`}
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
      <div>The node will not be started yet.</div>
      <div>
        <button type="button" onClick={onConfirmAddSpecificNode}>
          <span>Confirm</span>
        </button>
        &nbsp;
        <button type="button" onClick={onCancel}>
          <span>Cancel</span>
        </button>
      </div>
    </Modal>
  );
};
export default ConfirmAddNode;
