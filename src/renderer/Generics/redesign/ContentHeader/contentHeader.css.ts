import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// required to export even if not using in a component
export const container = style({
  boxSizing: 'border-box',
  color: vars.color.font70,
  borderBottom: vars.components.contentHeaderBorderBottom,
  boxShadow: vars.color.elevation2boxShadow,
  backgroundColor: vars.components.contentHeaderBackground,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 14px',
  position: 'relative',
  height: 52,
  width: '100%',
  selectors: {
    [`&.transparent`]: {
      backgroundColor: 'transparent',
      borderBottom: 'none',
    },
  },
});

export const textContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  selectors: {
    [`&.left`]: {
      textAlign: 'left',
    },
  },
});

export const titleStyle = style({
  fontWeight: 510,
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.12px',
  color: vars.components.contentHeaderTitle,
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
});

export const subtitleStyle = style({
  fontWeight: 400,
  fontSize: '11px',
  lineHeight: '14px',
  color: vars.components.contentHeaderSubtitle,
  flex: 'none',
  order: 1,
  alignSelf: 'stretch',
  flexGrow: 0,
});
