import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// required to export even if not using in a component
export const container = style({
  boxSizing: 'border-box',
  background: vars.components.walletPromptBackground,
  borderRadius: 10,
  height: 154,
  padding: 30,
  position: 'relative',
  overflow: 'hidden',
  marginBottom: 34,
});

export const title = style({
  fontStyle: 'normal',
  fontWeight: 590,
  fontSize: 15,
  lineHeight: '20px',
  letterSpacing: '-0.24px',
  color: vars.color.font,
});

export const description = style({
  width: 509,
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  letterSpacing: '-0.08px',
  color: vars.color.font70,
});

export const buttonContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 0,
  gap: 8,
  marginTop: 13,
});

export const backgroundIcon = style({
  position: 'absolute',
  width: 213.95,
  height: 213.95,
  left: 549,
  top: -31.97,
  opacity: 0.12,
  color: vars.color.font50,
});
