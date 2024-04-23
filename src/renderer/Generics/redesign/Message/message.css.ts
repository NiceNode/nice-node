import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// required to export even if not using in a component
export const container = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 16,
  boxSizing: 'border-box',
  borderRadius: '10px',
  padding: 24,
  position: 'relative',
  selectors: {
    '&.info': {
      backgroundColor: vars.components.messageInfoBackground,
    },
    '&.warning': {
      backgroundColor: vars.components.messageWarningBackground,
    },
    '&.error': {
      backgroundColor: vars.components.messageErrorBackground,
    },
    '&.success': {
      backgroundColor: vars.components.messageSuccessBackground,
    },
  },
});

export const messageIcon = style({
  width: 28,
  selectors: {
    '&.info': {
      color: vars.components.messageInfoIcon,
    },
    '&.warning': {
      color: vars.components.messageWarningIcon,
    },
    '&.error': {
      color: vars.components.messageErrorIcon,
    },
    '&.success': {
      color: vars.components.messageSuccessIcon,
    },
  },
});

export const textContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 4,
  width: 584,
});

export const messageTitle = style({
  fontStyle: 'normal',
  fontWeight: 590,
  fontSize: 15,
  lineHeight: '20px',
  letterSpacing: '-0.24px',
  color: vars.color.font,
});

export const messageDescription = style({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  letterSpacing: '-0.08px',
  color: vars.color.font70,
});

export const closeContainer = style({
  position: 'absolute',
  top: 16,
  right: 16,
});
