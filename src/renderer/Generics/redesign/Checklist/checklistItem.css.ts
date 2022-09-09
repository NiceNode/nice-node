import { style } from '@vanilla-extract/css';

export const container = style({
  borderBottom: '1px solid grey',
  // Auto layout

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: 0,
  gap: 12,

  width: 560,
  height: 36,

  // Inside auto layout

  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
  color: 'red',
});

// export const iconCss = style({
//   /* Check - Circle - Fill */

//   width: 16,
//   height: 16,

//   /* Inside auto layout */

//   flex: 'none',
//   order: 0,
//   flexGrow: 0,
// });
