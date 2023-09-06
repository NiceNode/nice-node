import { useEffect } from 'react';
import { ModalConfig } from '../ModalManager/modalUtils';
import { useAppSelector } from '../../state/hooks';
import { selectSelectedNode } from '../../state/node';

export interface ResetConfigWrapperProps {
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
}

const ResetConfigWrapper = ({
  modalOnChangeConfig,
}: ResetConfigWrapperProps) => {
  const selectedNode = useAppSelector(selectSelectedNode);

  useEffect(() => {
    modalOnChangeConfig({ selectedNode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode]);

  return <></>;
};

export default ResetConfigWrapper;
