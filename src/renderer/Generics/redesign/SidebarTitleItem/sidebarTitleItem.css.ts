import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const activeContainer = style({});

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  fontStyle: 'normal',
  fontWeight: '590',
  fontSize: '11px',
  lineHeight: '14px',
  padding: '8px 10px',
  width: '100%',
  color: vars.color.font40,
});
