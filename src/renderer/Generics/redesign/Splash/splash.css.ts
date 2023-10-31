import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1281px 169px',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: vars.color.background,
});

export const contentContainer = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: 424,
  height: 378,
});

export const titleFont = style({
  fontWeight: 500,
  fontSize: 42,
  lineHeight: '42px',
  color: vars.color.font,
  letterSpacing: '-0.01em',
  textAlign: 'center',
});

export const termsContainer = style({
  padding: '12px 16px 12px 16px',
  borderRadius: 6,
  border: `1px solid ${vars.color.background92}`,
});

export const termsText = style({
  fontWeight: 400,
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font50,
});

export const descriptionFont = style({
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  textAlign: 'center',
  color: vars.color.font70,
});

export const iconClass = style({
  width: 64,
  height: 64,
  filter: vars.components.iconFilterInvertForDarkOnly,
});
