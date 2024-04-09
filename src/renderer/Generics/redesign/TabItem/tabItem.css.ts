import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const container = style({
  listStyleType: 'none',
  fontWeight: 590,
  fontSize: '13px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  lineHeight: '16px',
  letterSpacing: '-0.12px',
  color: vars.color.font50,
  userSelect: 'none',
  cursor: 'pointer',
  selectors: {
    '&.active': {
      color: common.color.purple600,
    },
  },
});
