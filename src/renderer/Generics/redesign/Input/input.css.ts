import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const container = style({
  height: '16px',
  display: 'block',
  width: '-webkit-fill-available',
  padding: '6px 8px',
  backgroundColor: vars.color.background,
  backgroundClip: 'padding-box',
  color: 'inherit',
  border: '1px solid',
  borderColor: vars.color.border,
  borderRadius: '4px',
  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
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
