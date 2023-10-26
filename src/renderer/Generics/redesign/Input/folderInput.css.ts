import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
  minWidth: 400,
});

export const pathAndChangeContainer = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '0px',
  gap: 5,
});

export const freeStorageSpaceFontStyle = style({
  fontSize: 11,
  color: vars.color.font50,
  flexDirection: 'row',
  display: 'flex',
});

export const checkCircleIcon = style({
  width: 12,
  height: 12,
  marginRight: 3,
});
