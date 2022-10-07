import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  isolation: 'isolate',
  width: '268px',
  height: '400px',
  backgroundColor: 'rgba(0, 0, 2, 0.1)',
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
  padding: '0px 16px',
  height: '428px',
  overflowY: 'scroll',
  order: '2',
  alignSelf: 'stretch',
  flexGrow: '1',
});

export const itemList = style({
  padding: '16px',
  flex: 'none',
  order: '3',
  alignSelf: 'stretch',
  flexGrow: '0',
});
