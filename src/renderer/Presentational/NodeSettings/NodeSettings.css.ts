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
});
