import React from 'react';
import styled from 'styled-components';
import { vars } from '../Generics/redesign/theme.css';
import { HEADER_HEIGHT } from '../Header';
// eslint-disable-next-line import/no-cycle
// import { FOOTER_HEIGHT } from './Footer';

const LEFT_SIDEBAR_WIDTH = 100;
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
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding-bottom: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
  background: ${vars.components.menuBackground};
`;

type Props = {
  isSelected: boolean;
  children: React.ReactNode;
};

const MenuDrawer: React.FC<Props> = (props) => {
  const { isSelected, children } = props;
  return (
    <MenuDrawerStyled className={isSelected ? 'show' : 'hidde'}>
      {children}
    </MenuDrawerStyled>
  );
};
export default MenuDrawer;
