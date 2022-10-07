import { BsPlusSquareDotted } from 'react-icons/bs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import IconButton from '../IconButton';
import { Modal } from '../Generics/redesign/Modal/Modal';
import ConfirmAddNode from './ConfirmAddNode';
import { NodeSpecification } from '../../common/nodeSpec';
// import { DopeButton } from '../DivButton';
import electron from '../electronGlobal';
import AddNodeStepper from '../Presentational/AddNodeStepper/AddNodeStepper';
// todo: remove when new ui/ux redesign is further along
import { darkTheme, lightTheme } from '../Generics/redesign/theme.css';

const AddNode = () => {
  const { t } = useTranslation();
  const [sIsModalOpenAddNode, setIsModalOpenAddNode] = useState<boolean>();
  const [sIsModalOpenConfirmAddNode, setIsModalOpenConfirmAddNode] =
    useState<boolean>(false);
  const [sSelectedNodeSpecification, setSelectedNodeSpecification] =
    useState<NodeSpecification>();

  const onNodeSelected = (nodeSpec: NodeSpecification) => {
    // set selected node
    setSelectedNodeSpecification(nodeSpec);
    // open confirm add modal
    setIsModalOpenConfirmAddNode(true);
  };

  const onConfirmAddNode = () => {
    // close both modals
    setIsModalOpenConfirmAddNode(false);
    setIsModalOpenAddNode(false);
  };

  const onClickAddNodeButton = async () => {
    setIsModalOpenAddNode(true);
  };

  return (
    <div>
      <span>{t('Add Node')}</span>
      <IconButton type="button" onClick={onClickAddNodeButton}>
        <BsPlusSquareDotted />
      </IconButton>
      <div id="onBoarding" className={darkTheme}>
        <Modal
          title=""
          isOpen={sIsModalOpenAddNode}
          onClickCloseButton={() => setIsModalOpenAddNode(false)}
          isFullScreen
        >
          <AddNodeStepper
            onChange={(newValue: 'done' | 'cancel') => {
              console.log(newValue);
              if (newValue === 'done' || newValue === 'cancel') {
                setIsModalOpenAddNode(false);
              }
            }}
          />
        </Modal>
      </div>

      <ConfirmAddNode
        isOpen={sIsModalOpenConfirmAddNode}
        onConfirm={onConfirmAddNode}
        onCancel={() => setIsModalOpenConfirmAddNode(false)}
        nodeSpec={sSelectedNodeSpecification}
      />
    </div>
  );
};
export default AddNode;
