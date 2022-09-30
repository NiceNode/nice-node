import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const modalBackdropStyle = style({
  display: 'none',
  position: 'fixed',
  zIndex: 1,
  left: '0',
  top: '0',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  backgroundColor: 'rgba(0, 0, 2, 0.25)',
});

export const modalContentStyle = style({
  filter:
    'drop-shadow(0px 32px 64px rgba(0, 0, 0, 0.1876)) drop-shadow(0px 2px 21px rgba(0, 0, 0, 0.1474))',
  maxHeight: '95vh',
  backgroundColor: vars.color.background,
  padding: '20px',
  paddingTop: '0px',
  borderRadius: 14,
  width: '80%',
  top: '50%',
  left: '50%',
  position: 'fixed',
  transform: 'translate(-50%, -50%)',
  color: 'inherit',
  // a: { color: 'inherit' },
});
