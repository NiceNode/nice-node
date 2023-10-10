import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
});

export const graphicsContainer = style({
  minWidth: 250, // min-width works with flexGrow: 1 on the content
  '@media': {
    'screen and (max-width: 980px)': {
      display: 'none',
    },
  },
});

export const contentContainer = style({
  flexGrow: 1,
  overflow: 'auto',
  padding: '80px 64px',
  selectors: {
    [`&.modal`]: {
      padding: 0,
      overflow: 'visible',
    },
  },
});
