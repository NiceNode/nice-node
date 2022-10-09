import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const activeContainer = style({});

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 10px',
  height: '18px',
  borderRadius: '5px',
  cursor: 'pointer',
  userSelect: 'none',
});

export const selectedContainer = style({
  background: vars.color.background96,
});

export const labelText = style({
  flex: '1',
  fontWeight: '500',
  fontSize: '13px',
  lineHeight: '16px',
  color: vars.color.font70,
});
