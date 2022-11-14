import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const modalBackdropStyle = style({
  boxSizing: 'border-box',
  display: 'none',
  position: 'fixed',
  zIndex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  left: '0',
  top: '0',
  paddingTop: 30,
  paddingBottom: 30,
  width: '100%',
  height: '100%',
  overflow: 'auto',
  backgroundColor: vars.components.modalBackdropBackground,
});

export const modalContentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 150,
  boxSizing: 'border-box',
  filter:
    'drop-shadow(0px 32px 64px rgba(0, 0, 0, 0.1876)) drop-shadow(0px 2px 21px rgba(0, 0, 0, 0.1474))',
  maxHeight: '90vh',
  backgroundColor: vars.color.background,
  padding: '32px',
  paddingTop: '0px',
  borderRadius: 14,
  width: '80%',
  top: '50%',
  left: '50%',
  color: 'inherit',
  // a: { color: 'inherit' },
});

export const titleFont = style({
  fontSize: '28px',
  lineHeight: '28px',
  fontWeight: 590,
  paddingBottom: 16,
});

export const modalChildrenContainer = style({
  flex: 1,
  overflow: 'auto',
  // extra padding from scrollbar
  paddingRight: 10,
});
