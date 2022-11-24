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

export const title = style({
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

export const advancedOptionsLink = style({
  marginTop: 16,
});

export const advancedOptions = style({
  marginTop: 24,
  marginBottom: 40,
});

export const advancedOptionsDescription = style({
  fontWeight: 400,
  fontSize: '11px',
  lineHeight: '14px',
  color: vars.color.font50,
});

export const walletDetails = style({
  marginTop: 32,
});
