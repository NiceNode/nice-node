import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const nodeCommandTitle = style({
  fontWeight: 590,
  color: vars.color.font70,
  letterSpacing: '-0.12px',
  fontSize: '13px',
  lineHeight: '16px',
});

export const nodeCommandContainer = style({
  display: 'flex',
  paddingTop: 8,
});

export const nodeCommand = style({
  fontFamily: 'monospace',
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font50,
});

export const emptyContainer = style({
  minHeight: 1000,
  minWidth: 624,
});
