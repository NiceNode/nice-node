import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 24,
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
