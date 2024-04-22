import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const container = style({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  selectors: {
    '&.modal': {
      width: 560,
      height: 'auto',
    },
  },
  backgroundColor: vars.color.background,
});

export const componentContainer = style({
  width: '100%',
  flexGrow: 1,
  // Overflow-x hidden keeps the content and art container from growing
  //  more than 100% height and having a scroll
  // Overflow visible on y allows select menus to show and not be cut off. It will expand the height of the
  //  overall container to fit the select menu, however.
  overflow: 'visible',
  overflowX: 'hidden',
  boxSizing: 'border-box',
});

export const titleFont = style({
  fontWeight: 500,
  fontSize: 32,
  lineHeight: '32px',
  letterSpacing: '-0.01em',
});

export const descriptionFont = style({
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  color: vars.color.font70,
});

export const sectionFont = style({
  fontWeight: 600,
});
