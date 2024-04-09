import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const container = style({
  position: 'relative',
});

export const leftIconContainer = style({
  position: 'absolute',
  left: 8,
  top: 6,
  color: vars.color.font70,
});

export const rightIconContainer = style({
  position: 'absolute',
  right: 8,
  top: 6,
  color: vars.color.font70,
});

export const inputContainer = style({
  height: 28,
  display: 'block',
  width: '-webkit-fill-available',
  boxSizing: 'border-box',
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: 8,
  paddingRight: 8,
  backgroundColor: vars.color.background,
  backgroundClip: 'padding-box',
  color: 'inherit',
  border: '1px solid',
  borderColor: vars.color.border,
  borderRadius: '4px',
  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  selectors: {
    '&.leftIcon': {
      paddingLeft: 32,
    },
    '&.rightIcon': {
      paddingRight: 32,
    },
  },
  ':focus': {
    border: '1px solid',
    borderColor: vars.color.primary,
    outline: 0,
    boxShadow: '0 0 0 2px rgba(115, 81, 235, 0.25)',
  },
  ':disabled': {
    color: vars.color.font25,
    background: vars.color.background96,
    border: '1px solid',
    borderColor: vars.color.background92,
  },
  ':invalid': {
    border: '1px solid',
    borderColor: common.color.red,
  },
  '::placeholder': {
    color: vars.color.font25,
  },
});
