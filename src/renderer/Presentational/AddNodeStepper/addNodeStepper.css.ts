import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const container = style({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
});

export const componentContainer = style({
  width: '100%',
  flexGrow: 1,
  overflow: 'auto',
  boxSizing: 'border-box',
  paddingBottom: 20,
});

export const titleFont = style({
  fontWeight: 500,
  fontSize: 32,
  lineHeight: '32px',
  letterSpacing: '-0.01em',
});

export const descriptionFont = style({
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  color: vars.color.font70,
});

export const sectionFont = style({
  fontWeight: 600,
});
