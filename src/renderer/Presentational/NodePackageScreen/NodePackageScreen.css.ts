import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const container = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const contentContainer = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  width: 520,
});

export const titleFont = style({
  fontWeight: 590,
  fontSize: 15,
  lineHeight: '20px',
  color: vars.color.font,
  letterSpacing: '-0.24px',
  textAlign: 'center',
  marginBottom: 8,
});

export const descriptionFont = style({
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  color: vars.color.font70,
  letterSpacing: '-0.08px',
  marginBottom: 24,
});
