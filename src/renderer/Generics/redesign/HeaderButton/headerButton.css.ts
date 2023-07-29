import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  boxSizing: 'border-box',
  flex: 'none',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 5,
  gap: 10,
  width: 28,
  height: 28,
  borderRadius: 5,
  zIndex: 4,
  color: vars.color.font,
  ':hover': {
    backgroundColor: vars.components.headerButtonHover,
  },
  ':active': {
    backgroundColor: vars.components.headerButtonActive,
  },
});
