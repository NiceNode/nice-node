import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  boxSizing: 'border-box',
  background: vars.components.menuBackground,
  border: vars.components.menuBorder,
  boxShadow: vars.color.elevation4boxShadow,
  borderRadius: '5px',
  padding: '4px 0',
});
