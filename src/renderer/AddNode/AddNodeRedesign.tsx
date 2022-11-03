import { BsPlusSquareDotted } from 'react-icons/bs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import IconButton from '../IconButton';
import { Modal } from '../Generics/redesign/Modal/Modal';
import AddNodeStepper from '../Presentational/AddNodeStepper/AddNodeStepper';
// todo: remove when new ui/ux redesign is further along
import { darkTheme } from '../Generics/redesign/theme.css';

const AddNode = () => {
  const { t } = useTranslation();
  const [sIsModalOpenAddNode, setIsModalOpenAddNode] = useState<boolean>();

  const onClickAddNodeButton = async () => {
    setIsModalOpenAddNode(true);
  };

  return (
    <div>
      <span>{t('Add Node')}</span>
      <IconButton type="button" onClick={onClickAddNodeButton}>
        <BsPlusSquareDotted />
      </IconButton>
      <div className={darkTheme}>
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
    </div>
  );
};
export default AddNode;
