import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '12px',
  width: '236px',
  height: '56px',
  boxSizing: 'border-box',
  background: vars.components.bannerBackground,
  boxShadow:
    '0px 1px 1px rgba(0, 0, 0, 0.1), inset 0px 1px 0px rgba(255, 255, 255, 0.25)',
  borderRadius: '5px',
  color: 'vars.color.font70',
  padding: '12px',
});

export const textContainer = style({});

export const offline = style({
  fontStyle: 'normal',
  fontWeight: '590',
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.12px',
  marginBottom: '2px',
});

export const reconnect = style({
  fontWeight: '400',
  fontSize: '11px',
  lineHeight: '14px',
});
