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

export const walletContainer = style({
  flexDirection: 'row',
  display: 'flex',
  alignContent: 'center',
  alignItems: 'center',
});

export const walletTitle = style({
  marginLeft: 12,
});

export const walletImage = style({
  width: 24,
  height: 24,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
});
