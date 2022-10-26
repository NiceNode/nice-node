import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  width: '100%',
  height: 1,
  background: vars.color.font10,
  selectors: {
    [`&.content`]: {
      margin: '34px 0px',
    },
  },
});
