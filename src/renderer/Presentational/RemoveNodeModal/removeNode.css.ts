import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 332,
});

export const removeText = style({
  lineHeight: '18px',
});
