import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// required to export even if not using in a component
export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 8,
  gap: 2,
  fontSize: '11px',
  lineHeight: '14px',
  width: 177,
  color: vars.color.font70,
  border: vars.components.menuBorder,
  boxShadow: vars.color.elevation4boxShadow,
  backgroundColor: vars.components.menuBackground,
  borderRadius: 5,
});

export const titleStyle = style({
  fontWeight: 600,
});

export const contentStyle = style({
  fontWeight: 400,
});
