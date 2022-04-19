import styled from 'styled-components';
import { CgCloseO } from 'react-icons/cg';

import IconButton from './IconButton';

const ModalBackdrop = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  // padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  padding: 20px;
  padding-top: 0px;
  border: 1px solid #888;
  width: 80%;
  top: 50%;
  left: 50%;
  position: fixed;
  transform: translate(-50%, -50%);
  color: black;
`;

type Props = {
  children: React.ReactNode;
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
  title: string;
};

export const Modal = ({
  children,
  isOpen,
  onClickCloseButton,
  title,
}: Props) => {
  return (
    <ModalBackdrop style={{ display: isOpen ? 'block' : 'none' }}>
      <ModalContent
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex' }}>
          <h1 style={{ flexGrow: 1 }}>{title}</h1>
          <IconButton
            type="button"
            onClick={onClickCloseButton}
            style={{ paddingRight: 0 }}
          >
            <CgCloseO />
          </IconButton>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </ModalContent>
    </ModalBackdrop>
  );
};
