import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const modalBackdropStyle = style({
  boxSizing: 'border-box',
  display: 'flex',
  position: 'fixed',
  zIndex: 2,
  alignItems: 'center',
  justifyContent: 'center',
  left: '0',
  top: '0',
  paddingTop: 48,
  paddingBottom: 48,
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
  maxHeight: '80vh',
  backgroundColor: vars.color.background,
  paddingTop: '0px',
  borderRadius: 14,
  top: '50%',
  left: '50%',
  color: 'inherit',
  justifyContent: 'space-between',
  // a: { color: 'inherit' },
  selectors: {
    [`&.addNode`]: {
      height: '100%',
    },
    [`&.nodeSettings`]: {
      // maxHeight: 'none',
    },
    [`&.failSystemRequirements`]: {
      width: '380px',
    },
  },
});

export const modalCloseButton = style({
  position: 'absolute',
  top: 12,
  right: 14,
});

export const modalHeaderContainer = style({
  padding: '0px 0px 16px 0px',
  selectors: {
    [`&.alert`]: {
      padding: '24px 0px 6px 0px',
    },
  },
});

export const titleFont = style({
  fontSize: '28px',
  lineHeight: '28px',
  fontWeight: 590,
  paddingBottom: 16,
  flexGrow: 1,
  selectors: {
    [`&.alert`]: {
      fontSize: '15px',
      lineHeight: '20px',
      fontWeight: 590,
      paddingBottom: 6,
    },
    [`&.nodeSettings`]: {
      paddingLeft: 32,
    },
    [`&.failSystemRequirements`]: {
      fontSize: '20px',
      lineHeight: '24px',
      letterSpacing: '-0.4px',
    },
  },
});

export const modalStepperContainer = style({
  borderTop: `1px solid ${vars.color.background92}`,
  display: 'flex',
  flexDirection: 'row',
  padding: 14,
  justifyContent: 'flex-end',
  gap: 8,
  selectors: {
    [`&.alert`]: {
      borderTop: 'none',
      padding: 24,
    },
    [`&.info`]: {
      borderTop: 'none',
      padding: 24,
    },
  },
  zIndex: 3,
});

export const modalChildrenContainer = style({
  padding: '0px 32px',
  flex: 1,
  overflow: 'auto',
  selectors: {
    [`&.alert`]: {
      padding: '0px 24px',
      overflow: 'hidden',
    },
    [`&.info`]: {
      padding: 0,
      overflow: 'hidden',
    },
    [`&.addNode`]: {
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    [`&.nodeSettings`]: {
      padding: 0,
      overflowX: 'hidden',
    },
  },
});
