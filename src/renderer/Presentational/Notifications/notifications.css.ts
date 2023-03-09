import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const container = style({
  margin: '64px 40px',
  boxSizing: 'border-box',
});

export const headerContainer = style({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: 32,
  gap: 5,
  alignItems: 'center',
});

export const spacer = style({
  flexGrow: 1,
});

export const titleStyle = style({
  alignSelf: 'stretch',
  fontStyle: 'normal',
  fontWeight: '590',
  fontSize: '32px',
  lineHeight: '100%',
  textTransform: 'capitalize',
  color: vars.color.font,
});

export const emptyNotifications = style({});

export const popupContainer = style({
  position: 'absolute',
  right: 0,
  top: 32,
});

export const menuButtonContainer = style({
  position: 'relative',
});
