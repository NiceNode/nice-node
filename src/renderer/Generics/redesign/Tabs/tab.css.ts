import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

// required to export even if not using in a component

export const container = style({
  fontWeight: 590,
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.12px',
  color: vars.color.font50,
  cursor: 'pointer',
  selectors: {
    [`&.active`]: {
      color: common.color.purple600,
    },
  },
});
