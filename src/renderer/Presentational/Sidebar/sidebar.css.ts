import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  display: 'flex',
  width: '268px',
  height: '632px',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 2, 0.1)',
});

export const nodeList = style({
  padding: '0px 16px',
});

export const itemList = style({
  padding: '16px',
});
