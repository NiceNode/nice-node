import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  padding: '8px 0px',
  width: '100%',
});

export const innerContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '12px',
  minHeight: 56,
  boxSizing: 'border-box',
  background: vars.components.bannerBackground,
  boxShadow: vars.components.bannerBoxShadow,
  borderRadius: '5px',
  color: vars.color.font70,
  padding: '12px',
  selectors: {
    '&.loading': {
      color: vars.color.font50,
    },
  },
});

export const textContainer = style({});

export const titleStyle = style({
  fontStyle: 'normal',
  fontWeight: '590',
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.12px',
  marginBottom: '2px',
});

export const descriptionStyle = style({
  fontWeight: '400',
  fontSize: '11px',
  lineHeight: '14px',
});
