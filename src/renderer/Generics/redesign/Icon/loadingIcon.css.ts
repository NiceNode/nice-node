import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const loadingIcon = style({
  fill: vars.color.font,
  animationName: rotate,
  animationDuration: '3s',
  animationIterationCount: 'infinite',
  // todo: more generic fix height to icon size
  // since a container span is rotating, not the icon directly,
  // this has to be the same height of the icon
  height: 16,
  width: 16,
});
