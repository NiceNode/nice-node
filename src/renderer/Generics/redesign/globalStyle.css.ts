import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

globalStyle('#onBoarding', {
  fontFamily:
    '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu',
  fontSize: 13,
  background: vars.color.background,
  color: vars.color.font,
});

globalStyle('.redesignComponent', {
  fontFamily:
    '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu',
  fontSize: 13,
  background: vars.color.background,
  color: vars.color.font,
});
