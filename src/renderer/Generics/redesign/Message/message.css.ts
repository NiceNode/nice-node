import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// required to export even if not using in a component
export const container = style({
  boxSizing: 'border-box',
  borderRadius: '10px',
  width: 730,
  padding: '24px 24px 24px 68px',
  position: 'relative',
  selectors: {
    [`&.info`]: {
      backgroundColor: vars.components.messageInfoBackground,
    },
    [`&.warning`]: {
      backgroundColor: vars.components.messageWarningBackground,
    },
    [`&.error`]: {
      backgroundColor: vars.components.messageErrorBackground,
    },
    [`&.success`]: {
      backgroundColor: vars.components.messageSuccessBackground,
    },
  },
});

export const messageTitle = style({
  fontStyle: 'normal',
  fontWeight: 590,
  fontSize: 15,
  lineHeight: '20px',
  letterSpacing: '-0.24px',
  color: vars.color.font,
  marginBottom: 12,
});

export const messageDescription = style({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  letterSpacing: '-0.08px',
  color: vars.color.font70,
});
