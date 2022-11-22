import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const container = style({
  listStyleType: 'none',
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
