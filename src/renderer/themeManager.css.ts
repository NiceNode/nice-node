import { style } from '@vanilla-extract/css';
import { vars } from './Generics/redesign/theme.css';

export const background = style({
  background: vars.color.background,
  // selectors: {
  //   '&.darwin': {
  //     background: 'none',
  //   },
  // },
});
