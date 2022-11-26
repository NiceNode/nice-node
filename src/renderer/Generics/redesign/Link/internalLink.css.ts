import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const linkText = style({
  color: vars.color.primary,
  letterSpacing: '-0.08px',
  textDecoration: 'none',
  ':hover': {
    color: vars.color.primaryHover,
    textDecoration: 'none',
  },
  ':link': {
    textDecoration: 'none',
  },
  ':visited': {
    textDecoration: 'none',
  },
});

export const dangerLinkText = style({
  color: common.color.red500,
  ':hover': {
    color: vars.color.dangerLinkHover,
  },
  ':visited': {
    color: common.color.red500,
  },
});
