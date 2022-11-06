import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 16,
});

export const captionText = style({
  paddingTop: 4,
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font50,
});
