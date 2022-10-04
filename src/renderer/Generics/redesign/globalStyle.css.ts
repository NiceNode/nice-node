import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

globalStyle('#onBoarding', {
  fontFamily: 'Inter',
  fontSize: 13,
  background: vars.color.background,
  color: vars.color.font,
});

globalStyle('.redesignComponent', {
  fontFamily: 'Inter',
  fontSize: 13,
  background: vars.color.background,
  color: vars.color.font,
});
