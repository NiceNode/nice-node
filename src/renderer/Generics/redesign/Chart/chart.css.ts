import { style, keyframes } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(359deg)' },
});

export const container = style({
  width: '100%',
  height: 196,
  selectors: {
    '&.spaceBetween': {
      justifyContent: 'space-between',
    },
  },
});

export const iconContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

export const iconComponent = style({
  animationDuration: '2s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
  animationName: rotate,
  width: 20,
  height: 20,
});
