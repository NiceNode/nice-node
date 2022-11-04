import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// required to export even if not using in a component
export const container = style({
  boxSizing: 'border-box',
  borderRadius: 5,
  width: 292,
  height: 160,
  padding: 16,
  position: 'relative',
  overflow: 'hidden',
  border: vars.components.menuBorder,
  boxShadow: vars.color.elevation4boxShadow,
  backgroundColor: vars.components.menuBackground,
});

export const title = style({
  fontStyle: 'normal',
  fontWeight: 590,
  fontSize: 13,
  lineHeight: '16px',
  letterSpacing: '-0.12px',
  color: vars.color.font,
  marginBottom: 8,
});

export const description = style({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  letterSpacing: '-0.08px',
  color: vars.color.font70,
  marginBottom: 8,
});

export const link = style({
  marginBottom: 8,
});

export const buttonContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 0,
  gap: 8,
  marginTop: 13,
});
