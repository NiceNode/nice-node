import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'renderer/state/hooks';
import { getModalState, setModalState } from '../../../state/modal';

const Screen1 = () => <div>Add Node!</div>;
const Screen2 = () => <div>Screen 2</div>;

const ModalManager = () => {
  const dispatch = useAppDispatch();
  const { isModalOpen, screen } = useSelector(getModalState);

  if (!isModalOpen) {
    return null;
  }

  let modalComponent = null;
  // Render the appropriate screen based on the current `screen` value
  switch (screen.route) {
    case 'addNode':
      modalComponent = <Screen1 />;
      break;
    case 'screen2':
      modalComponent = <Screen2 />;
      break;
    default:
  }

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: 'white',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '1rem',
        }}
      >
        {modalComponent}
        <button
          type="button"
          onClick={() => {
            dispatch(
              setModalState({
                isModalOpen: false,
                screen: { route: undefined, type: undefined },
              })
            );
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalManager;
