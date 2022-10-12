import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  height: '100%',
  width: 1,
  background: vars.color.font10,
  selectors: {
    [`&.content`]: {
      margin: '34px 0px',
    },
  },
});
