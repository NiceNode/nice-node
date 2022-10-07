import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const imageStyle = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(359deg)' },
});

const healthyPulse = keyframes({
  '0%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(62, 187, 100, 0.7)',
  },
  '70%': {
    transform: 'scale(1)',
    boxShadow: '0 0 0 5px rgba(62, 187, 100, 0)',
  },
  '100%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(62, 187, 100, 0)',
  },
});

const warningPulse = keyframes({
  '0%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(251, 146, 65, 0.7)',
  },
  '70%': {
    transform: 'scale(1)',
    boxShadow: '0 0 0 5px rgba(251, 146, 65, 0)',
  },
  '100%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(251, 146, 65, 0)',
  },
});

const errorPulse = keyframes({
  '0%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(235, 83, 76, 0.7)',
  },
  '70%': {
    transform: 'scale(1)',
    boxShadow: '0 0 0 5px rgba(235, 83, 76, 0)',
  },
  '100%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(235, 83, 76, 0)',
  },
});

export const hasStatusStyle = style({});
export const smallStyle = style({});
export const mediumStyle = style({});
export const largeStyle = style({});
export const healthy = style({ background: vars.color.green });
export const warning = style({ background: vars.color.yellow });
export const error = style({ background: vars.color.red });
export const sync = style({});

export const iconBackground = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  MozBoxSizing: 'border-box',
  WebkitBoxSizing: 'border-box',
  border: '1px solid rgba(0, 0, 2, 0.04)',
  width: '100%',
  height: '100%',
  selectors: {
    [`&.${smallStyle}`]: {
      width: 32,
      height: 32,
      borderRadius: 12,
    },
    [`&.${mediumStyle}`]: {
      width: 40,
      height: 40,
      borderRadius: 14,
    },
    [`&.${largeStyle}`]: {
      width: 56,
      height: 56,
      borderRadius: 18,
    },
    [`&.${smallStyle}.${hasStatusStyle}`]: {
      WebkitMaskImage:
        'radial-gradient(circle 8px at calc(100% - 4px) calc(100% - 28px),transparent 6px,#000 0)',
    },
    [`&.${mediumStyle}.${hasStatusStyle}`]: {
      WebkitMaskImage:
        'radial-gradient(circle 10px at calc(100% - 5px) calc(100% - 35px),transparent 7px,#000 0)',
    },
    [`&.${largeStyle}.${hasStatusStyle}`]: {
      WebkitMaskImage:
        'radial-gradient( circle 26px at calc(100% - 7px) calc(100% - 49px),transparent 10px,#000 0)',
    },
  },
});

export const containerStyle = style({
  position: 'relative',
  selectors: {
    [`&.${smallStyle}`]: {
      width: 32,
      height: 32,
    },
    [`&.${mediumStyle}`]: {
      width: 40,
      height: 40,
    },
    [`&.${largeStyle}`]: {
      width: 56,
      height: 56,
    },
  },
});

export const iconStyle = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  MozBoxSizing: 'border-box',
  WebkitBoxSizing: 'border-box',
});

export const statusStyle = style({
  boxSizing: 'border-box',
  position: 'absolute',
  right: '0',
  top: '0',
  zIndex: 1,
  animationDuration: '2s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
  transform: 'scale(0.5)',
  selectors: {
    [`&.${healthy}`]: {
      animationName: healthyPulse,
    },
    [`&.${warning}`]: {
      animationName: warningPulse,
    },
    [`&.${error}`]: {
      animationName: errorPulse,
    },
    [`&.${smallStyle}`]: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    [`&.${mediumStyle}`]: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    [`&.${largeStyle}`]: {
      width: 14,
      height: 14,
      borderRadius: 7,
    },
    [`&.${sync}`]: {
      animationName: rotate,
      animationDuration: '2s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
      fill: vars.color.font,
      right: '-1px',
      top: '-1px',
    },
    [`&.${smallStyle}.${sync}`]: {
      width: '9px',
      height: '14px',
      top: '-3px',
      right: '0px',
    },
    [`&.${mediumStyle}.${sync}`]: {
      width: '12px',
      height: '12px',
    },
    [`&.${largeStyle}.${sync}`]: {
      width: '16px',
      height: '16px',
    },
  },
});
