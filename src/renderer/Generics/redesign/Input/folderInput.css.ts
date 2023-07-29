import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
  minWidth: 400,
  height: 52,
});

export const pathAndChangeContainer = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '0px',
  gap: 20,
});

export const freeStorageSpaceFontStyle = style({
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font50,
});
