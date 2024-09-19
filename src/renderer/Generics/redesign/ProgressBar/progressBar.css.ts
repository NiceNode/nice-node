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
  background: vars.color.font8,
});

export const percentTextLeft = style({
  position: 'absolute',
  top: '45%',
  right: 5,
  transform: 'translateY(-50%)',
});

export const percentTextRight = style({
  position: 'absolute',
  left: 5,
  top: '45%',
  transform: 'translateY(-50%)',
});

export const innerDiv = style({
  height: 16,
  backgroundColor: vars.components.progressBarBackground,
});

export const sectionFont = style({
  fontWeight: 600,
  marginBottom: 8,
});

export const captionText = style({
  paddingTop: 8,
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font50,
});

export const cardDownloadingProgressContainer = style({});

export const downloadingProgressContainer = style({
  borderColor: vars.color.border,
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 20,
});
