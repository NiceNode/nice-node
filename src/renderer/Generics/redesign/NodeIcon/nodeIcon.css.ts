import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const imageStyle = style({
  // position: 'relative',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

export const hasStatusStyle = style({});
export const smallStyle = style({});
export const mediumStyle = style({});
export const largeStyle = style({});
export const green = style({ background: common.color.green });
export const yellow = style({ background: common.color.yellow });
export const red = style({ background: common.color.red });
export const stopped = style({ background: vars.components.nodeIconStopped });
export const sync = style({});
export const updating = style({});

export const iconBackground = style({
  // position: 'relative',
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
  // position: 'relative',
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
  // position: 'relative',
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
  zIndex: 1,
  color: vars.color.font70,
  selectors: {
    [`&.${updating}`]: {
      color: 'gray', // TODO: change this to radial gradient somehow
    },
    [`&.${smallStyle}`]: {
      // 32px icon width - 8px status width
      left: '24px',
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    [`&.${mediumStyle}`]: {
      // 40px icon width - 10px status width
      left: '30px',
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    [`&.${largeStyle}`]: {
      // 56px icon width - 14px status width
      left: '42px',
      width: 14,
      height: 14,
      borderRadius: 7,
    },
    [`&.${smallStyle}.${sync}`]: {
      left: '24px',
      top: '-2.5px',
      width: '10px',
      height: '8px',
    },
    [`&.${mediumStyle}.${sync}`]: {
      left: '30px',
      top: '-1px',
      width: '10px',
      height: '8px',
    },
    [`&.${largeStyle}.${sync}`]: {
      left: '40.67px',
      top: '-1.33px',
      width: '16.67px',
      height: '12.67px',
    },
    [`&.${smallStyle}.${updating}`]: {
      left: '22px',
      top: '-2px',
      width: '12px',
      height: '12px',
    },
    [`&.${mediumStyle}.${updating}`]: {
      left: '29px',
      top: '-1px',
      width: '12px',
      height: '12px',
    },
    [`&.${largeStyle}.${updating}`]: {
      left: '39px',
      top: '-3px',
      width: '20px',
      height: '20px',
    },
  },
});
