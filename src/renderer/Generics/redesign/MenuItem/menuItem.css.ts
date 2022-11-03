import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const container = style({
  cursor: 'pointer',
  boxSizing: 'border-box',
  height: 28,
  width: '100%',
  padding: '6px 12px',
  color: common.color.black85,
  userSelect: 'none',
  ':hover': {
    background: vars.components.headerButtonHover,
  },
  selectors: {
    [`&.disabled`]: {
      color: common.color.black40,
    },
  },
});

export const menuItemText = style({
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.08px',
});
