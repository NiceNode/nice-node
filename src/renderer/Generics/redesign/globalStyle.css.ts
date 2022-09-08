import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

globalStyle('#onBoarding', {
  background: vars.color.background,
  color: vars.color.font,
});
