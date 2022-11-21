import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const baseTab = style({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',

  fontWeight: 500,
  fontSize: 13,
  lineHeight: '16px',
  height: '32px',
  ':hover': {
    color: vars.color.font70,
  },
});

export const activeTab = style([
  {
    color: vars.color.primaryActive,
  },
]);

export const idleTab = style([
  {
    color: vars.color.font50,
  },
]);
