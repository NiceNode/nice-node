import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const outerDiv = style({
  height: 16,
  width: '100%',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: vars.color.background92,
  borderRadius: 4,
  boxSizing: 'border-box',
  overflow: 'hidden',
});

export const innerDiv = style({
  height: 16,
  backgroundColor: vars.color.primary,
});

export const sectionFont = style({
  fontWeight: 600,
  marginBottom: 8,
});

export const captionText = style({
  paddingTop: 4,
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font50,
});

export const downloadingProgressContainer = style({
  borderColor: vars.color.border,
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 20,
});
