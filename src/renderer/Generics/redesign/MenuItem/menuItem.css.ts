import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  cursor: 'pointer',
  boxSizing: 'border-box',
  height: 28,
  width: '100%',
  padding: '6px 12px',
  color: vars.color.font,
  userSelect: 'none',
  ':hover': {
    background: vars.components.headerButtonHover,
  },
  selectors: {
    [`&.disabled`]: {
      color: vars.color.fontDisabled,
    },
  },
});

export const menuItemText = style({
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.08px',
  flex: 'none',
  order: 0,
  flexGrow: 1,
});

export const statusDot = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  selectors: {
    [`&.blue`]: {
      backgroundColor: common.color.blue500,
    },
    [`&.orange`]: {
      backgroundColor: common.color.orange400,
    },
    [`&.red`]: {
      backgroundColor: common.color.red500,
    },
  },
});

export const selectIcon = style({
  color: common.color.purple600,
  flex: 'none',
  order: 1,
  flexGrow: 0,
});
