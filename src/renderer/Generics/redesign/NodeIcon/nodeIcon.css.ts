import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const imageStyle = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

export const hasStatusStyle = style({});
export const smallStyle = style({});
export const mediumStyle = style({});
export const largeStyle = style({});
export const healthy = style({ background: 'green' });
export const warning = style({ background: 'yellow' });
export const error = style({ background: 'red' });
export const sync = style({ background: 'black' });

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
  selectors: {
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
  },
  // '&.darkMode': { '&.sync': { backgroundColor: 'rgba(255, 255, 255, 1)' } },
  // selectors: {
  //   '&.sync': {
  //     animation: 'rotation 2s infinite linear',
  //     right: '-1px',
  //     WebkitMaskSize: 'cover',
  //     maskSize: 'cover',
  //     backgroundColor: 'rgba(0, 0, 2, 0.95)',
  //   },
  //   '&.small': {
  //     // '&.sync': { width: '10px', height: '8px', backgroundSize: '10px 8px' },
  //   },
  //   '&.medium': {
  //     // '&.sync': { width: '12px', height: '10px', backgroundSize: '12px 10px' },
  //   },
  //   '&.large': {
  //     // '&.sync': { width: '16px', height: '13px', backgroundSize: '16px 13px' },
  //   },
  // },
});
