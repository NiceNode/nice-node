import { useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import styled from 'styled-components';

import { Modal } from './Modal';

const InfoButton = styled.button`
  background: transparent;
  color: inherit;
  box-shadow: none;
  padding: 2px;
`;

type Props = {
  title: string;
  children: React.ReactNode;
};

export const InfoModal = ({ title, children }: Props) => {
  const [sIsModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <InfoButton type="button" onClick={() => setIsModalOpen(true)}>
        <MdInfoOutline />
      </InfoButton>
      <Modal
        title={title}
        isOpen={sIsModalOpen}
        onClickCloseButton={() => setIsModalOpen(false)}
      >
        {children}
      </Modal>
    </>
  );
};
