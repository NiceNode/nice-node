import { keyframes, style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const container = style({
  // Auto layout
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: 0,
  gap: 12,

  // Inside auto layout
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
});

export const textContainer = style({
  /* Auto layout */
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  gap: 4,

  /* Inside auto layout */
  order: 1,
  flexGrow: 1,
});

export const checkTitleClass = style({
  fontWeight: 600,
  fontSize: 13,
  lineHeight: '16px',
  color: vars.color.font,
});

export const valueTextClass = style({
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '16px',
  color: vars.color.font50,
});

export const captionTextClass = style({
  fontWeight: 400,
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font70,
});

export const successIcon = style({
  color: common.color.green,
  width: 16,
  height: 16,
});

export const infoIcon = style({
  color: vars.color.font40,
});

export const warningIcon = style({
  color: common.color.yellow,
});

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const loadingIcon = style({
  fill: vars.color.font,
  animationName: rotate,
  animationDuration: '3s',
  animationIterationCount: 'infinite',
  width: 16,
  height: 16,
});

export const errorIcon = style({
  color: common.color.red,
});
