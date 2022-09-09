import { style } from '@vanilla-extract/css';

import { vars } from '../theme.css';

export const container = style({
  background: vars.color.font,
  width: 16,
  height: 16,

  /* Inside auto layout */

  // flex: 'none',
  // order: 0,
  // flexGrow: 0,
});
//   // Auto layout

//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'flex-start',
//   padding: 0,
//   gap: 12,

//   width: 560,
//   height: 36,

//   // Inside auto layout

//   flex: 'none',
//   order: 0,
//   alignSelf: 'stretch',
//   flexGrow: 0,
// });

// export const iconCss = style({
//   /* Check - Circle - Fill */

//   width: 16,
//   height: 16,

//   /* Inside auto layout */

//   flex: 'none',
//   order: 0,
//   flexGrow: 0,
// });
