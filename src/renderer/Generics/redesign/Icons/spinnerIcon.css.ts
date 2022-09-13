import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const container = style({
  fill: vars.color.font,
  animationName: rotate,
  animationDuration: '3s',
  animationIterationCount: 'infinite',
});
