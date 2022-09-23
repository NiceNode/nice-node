import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const bottomBar = style({
  height: 60,
  borderTop: '1px solid',
  borderColor: vars.color.font10,
  display: 'flex',
  justifyContent: 'space-between',
});

export const previousButton = style({
  // boxSizing: 'border-box',
  // display: 'flex',
  // flexDirection: 'row',
  // justifyContent: 'center',
  // alignItems: 'center',
  // padding: '8px 12px',
  // gap: '10px',
  // width: '78px',
  // height: '32px',
  marginLeft: '14px',
  marginTop: '14px',
});

export const nextButton = style({
  // boxSizing: 'border-box',
  // display: 'flex',
  // flexDirection: 'row',
  // justifyContent: 'center',
  // alignItems: 'center',
  // padding: '8px 12px',
  // gap: '10px',
  // width: '78px',
  // height: '32px',
  marginRight: '14px',
  marginTop: '14px',
});

export const titleFont = style({
  fontWeight: 600,
  fontSize: 15,
  lineHeight: '20px',
});
