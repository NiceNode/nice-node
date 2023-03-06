import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const headerContainer = style({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: 32,
  gap: 5,
  alignItems: 'center',
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
