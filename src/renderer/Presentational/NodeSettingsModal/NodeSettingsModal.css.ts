import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const walletDescription = style({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: '18px',
  letterSpacing: '-0.08px',
  color: vars.color.font70,
  marginBottom: 24,
});

export const walletsTitle = style({
  fontWeight: 590,
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.12px',
  marginBottom: 8,
});
