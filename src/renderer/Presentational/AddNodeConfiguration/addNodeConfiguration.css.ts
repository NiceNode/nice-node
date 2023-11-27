import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 16,
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
  marginBottom: 8,
});

export const sectionFont = style({
  fontWeight: 600,
  marginBottom: 0,
});

export const advancedOptionsLink = style({
  marginTop: 16,
});

export const initialClientConfigContainer = style({
  width: '100%',
});

export const settingsContainer = style({
  width: '100%',
});

export const horizontalContainer = style({
  marginTop: 16,
});

export const dataLocationContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
});
