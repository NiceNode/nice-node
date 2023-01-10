import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const imageStyle = style({
  // position: 'relative',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

export const hasStatusStyle = style({
  WebkitMaskImage:
    'radial-gradient(circle 8px at calc(100% - 23px) calc(100% - 23px),transparent 6px,#000 0)',
});
export const smallStyle = style({});

export const iconBackground = style({
  // position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  MozBoxSizing: 'border-box',
  WebkitBoxSizing: 'border-box',
  width: 24,
  height: 24,
  borderRadius: 5,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.16)',
});

export const containerStyle = style({
  width: 24,
  height: 24,
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
  background: common.color.red500,
  top: '-3px',
  left: '-3px',
  width: 8,
  height: 8,
  borderRadius: 4,
});
