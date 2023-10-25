import { style } from '@vanilla-extract/css';
import { common, vars } from '../../Generics/redesign/theme.css';

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

export const advancedOptionsListContainer = style({
  marginTop: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

export const advancedOptionsItemContainer = style({
  marginTop: 10,
  marginBottom: 9,
  flex: 'none',
  alignSelf: 'stretch',
  flexGrow: 0,
  flexDirection: 'row',
  display: 'flex',
  alignContent: 'center',
  alignItems: 'center',
});

export const walletDetails = style({
  marginTop: 32,
  marginBottom: 20,
});

export const networkValue = style({
  flexDirection: 'row',
  display: 'flex',
  alignContent: 'center',
  alignItems: 'center',
  gap: 12,
});

export const selectContainer = style({
  marginLeft: 12,
  width: 160,
});

export const inputContainer = style({
  marginLeft: 8,
  width: '100%',
});

export const buttonContainer = style({
  marginLeft: 8,
});

export const addRow = style({
  marginTop: 16,
});

export const copyIcon = style({
  width: 14,
  height: 14,
  color: common.color.purple500,
  cursor: 'pointer',
});

export const unableSetWallet = style({
  paddingBottom: 36,
});

export const copyButtonContainer = style({
  position: 'relative',
});
