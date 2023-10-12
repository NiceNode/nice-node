import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const bottomBar = style({
  height: 60,
  width: '100%',
  // Prevents from shrinking height below 60px. Idk why it is needed
  flexShrink: 0,
  borderTop: '1px solid',
  borderColor: vars.color.font10,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export const previousButton = style({
  marginLeft: '14px',
  marginTop: '14px',
});

export const nextButton = style({
  marginRight: '14px',
  marginTop: '14px',
});
