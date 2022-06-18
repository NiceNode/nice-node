import { CgCloseO } from 'react-icons/cg';
import React from 'react';
import styled from 'styled-components';

import IconButton from '../IconButton';
import { LEFT_SIDEBAR_WIDTH } from '../LeftSideBar';
import { HEADER_HEIGHT } from '../Header';
// eslint-disable-next-line import/no-cycle
// import { FOOTER_HEIGHT } from './Footer';

const FOOTER_HEIGHT = 64;

const MenuDrawerStyled = styled.div`
  display: box;
  &.show {
    bottom: ${FOOTER_HEIGHT}px;
  }
  &.hidde {
    bottom: calc(-100vh - ${FOOTER_HEIGHT}px);
  }
  position: fixed;
  width: calc(100vw - ${LEFT_SIDEBAR_WIDTH}px);
  margin-left: ${LEFT_SIDEBAR_WIDTH}px;
  // height of screen - footer height - header height
  height: calc(100vh - ${FOOTER_HEIGHT}px - ${HEADER_HEIGHT}px);
  transition: bottom 0.2s ease-out 0s;
  background: linear-gradient(
    -160.96deg,
    #7a2c9e -29.09%,
    #dd5789 51.77%,
    #fedc2a 129.35%
  );
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
`;

type Props = {
  title: string;
  isSelected: boolean;
  onClickCloseButton: () => void;
  children: React.ReactNode;
};

const MenuDrawer: React.FC<Props> = (props) => {
  const { title, isSelected, onClickCloseButton, children } = props;
  return (
    <MenuDrawerStyled className={isSelected ? 'show' : 'hidde'}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          marginLeft: 15,
          marginRight: 15,
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
      </div>
    </MenuDrawerStyled>
  );
};
export default MenuDrawer;
