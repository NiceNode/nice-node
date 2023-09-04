import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  boxSizing: 'border-box',
  padding: '0px 11px 16px 16px',
  paddingTop: '52px',
  isolation: 'isolate',
  width: '268px',
  height: '100%',
  backgroundColor: vars.components.sidebarBackground,
  // backdropFilter: 'blur(40px)',
});

export const titleItem = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flex: 'none',
  order: '0',
  alignSelf: 'stretch',
  flexGrow: '0',
});

export const nodeList = style({
  overflowY: 'auto',
  order: '2',
  alignSelf: 'stretch',
  flexGrow: '1',
});

export const itemList = style({
  paddingTop: '16px',
  flex: 'none',
  order: '3',
  alignSelf: 'stretch',
  flexGrow: '0',
});
