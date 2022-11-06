import { style } from '@vanilla-extract/css';

export const titleFont = style({
  fontWeight: 590,
  fontSize: 15,
  lineHeight: '20px',
  letterSpacing: '-0.24px',
});

export const columnContainerStyle = style({
  display: 'grid',
  columnGap: 41,
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: 'masonry',
});

export const columnItemStyle = style({
  margin: 0,
  display: 'grid',
  gridTemplateRows: '1fr auto',
});
