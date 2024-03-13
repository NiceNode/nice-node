import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 16,
  paddingBottom: 20,
  minHeight: '40vh',
  // height must be set along with border box to avoid a small scroll bar
  // due to the 20px of padding on the bottom
  height: '100%',
  boxSizing: 'border-box',
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
  marginBottom: 8,
});

export const sectionFont = style({
  fontWeight: 600,
  marginBottom: 0,
});

export const descriptionContainer = style({
  marginBottom: 16,
});
