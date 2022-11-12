import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const container = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '4px 0px',
  gap: 8,
});
