import { style, ComplexStyleRule } from '@vanilla-extract/css';

export const dragWindowContainer = style({
  WebkitUserSelect: 'none',
  '-webkit-app-region': 'drag',
  height: 52,
  width: '100vw',
  position: 'absolute',
  top: 0,
  zIndex: 3,
  cursor: 'grab',
} as ComplexStyleRule); // fix for lacking '-webkit-app-region' type

export const homeContainer = style({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
});

export const contentContainer = style({
  padding: '64px 40px',
  boxSizing: 'border-box',
  flex: 1,
  overflow: 'auto',
});
