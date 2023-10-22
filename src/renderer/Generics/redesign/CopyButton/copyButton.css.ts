import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const copyIcon = style({
  color: vars.color.font70,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      color: '#753bf4',
    },
  },
});

export const checkIcon = style({
  color: 'green',
});
