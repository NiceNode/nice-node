import { style } from '@vanilla-extract/css';

export const contianer = style({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
});

export const graphicsContianer = style({
  minWidth: 380, // min-width works with flexGrow: 1 on the content
  '@media': {
    'screen and (max-width: 980px)': {
      display: 'none',
    },
  },
});

export const contentContianer = style({ flexGrow: 1, paddingRight: 32 });
