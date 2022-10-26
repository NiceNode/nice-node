import { style } from '@vanilla-extract/css';

export const activeContainer = style({});

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 0,
  gap: 16,
  height: 38,
});
