import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  gap: '4px',
  color: vars.color.primary,
  ':hover': {
    color: vars.color.primaryHover,
  },
});

export const linkText = style({
  color: vars.color.primary,
  ':hover': {
    color: vars.color.primaryHover,
  },
});
