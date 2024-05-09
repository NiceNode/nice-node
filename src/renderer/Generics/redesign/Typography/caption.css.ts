import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const captionTextClass = style({
  fontWeight: 400,
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font70,
  selectors: {
    '&.modal': {
      color: vars.color.font50,
    },
  },
});
