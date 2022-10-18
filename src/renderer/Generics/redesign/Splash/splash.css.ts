import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1281px 169px',
  width: '100%',
  height: '100%',
});

export const contentContainer = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  position: 'absolute',
  width: 420,
  height: 378,
  left: 'calc(50% - 420px/2)',
  top: 'calc(50% - 378px/2 - 16px)',
});

export const titleFont = style({
  fontWeight: 500,
  fontSize: 42,
  lineHeight: '42px',
  color: vars.color.font,
  letterSpacing: '-0.01em',
  textAlign: 'center',
});

export const descriptionFont = style({
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  color: vars.color.font70,
});

export const iconClass = style({
  width: 64,
  height: 64,
});
