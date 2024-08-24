import { style } from '@vanilla-extract/css';
import { vars, common } from '../../Generics/redesign/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

export const removeText = style({
  lineHeight: '18px',
});

export const statusContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const statusIcon = style({
  marginBottom: 10,
});

export const successIcon = style({
  color: common.color.green500, // Adjusted to a green color similar to the checkmark
  width: 24,
  height: 24,
});

export const statusText = style({
  fontSize: 13,
  textAlign: 'center',
  marginBottom: 19,
});

export const statusButton = style({
  width: '100%',
});
