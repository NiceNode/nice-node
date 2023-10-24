import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const copyIcon = style({
  color: vars.color.font40,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      color: common.color.purple600,
    },
  },
});

export const checkIcon = style({
  color: 'green',
});

export const copyMessage = style({
  position: 'absolute',
  top: '-3em',
  left: '-3em',
  color: vars.color.font70,
  backgroundColor: vars.color.background,
  padding: '0.5em',
  borderRadius: '4px',
  display: 'none',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
});
