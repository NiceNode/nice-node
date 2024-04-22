import { type ComplexStyleRule, style } from '@vanilla-extract/css';
import { vars } from './Generics/redesign/theme.css';

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
  padding: '64px 40px 64px 37px',
  boxSizing: 'border-box',
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  background: vars.color.background,
  position: 'relative',
});

export const sidebarDrag = style({
  cursor: 'ew-resize',
  width: 7,
  height: '100%',
  display: 'flex',
});

export const borderLeft = style({
  backgroundColor: vars.components.sidebarBackground,
  width: 3,
  height: '100%',
  selectors: {
    '&.darwin': {
      backgroundColor: 'transparent',
    },
  },
});

export const borderCenter = style({
  flexGrow: 1,
  maxWidth: 1,
  backgroundColor: vars.color.background,
  height: '100%',
});

export const borderCenterLine = style({
  backgroundColor: vars.components.sidebarBorder,
  height: '100%',
  width: 1,
  selectors: {
    '&.darwin': {
      backgroundColor: vars.components.sidebarMacBorder,
    },
  },
});

export const borderRight = style({
  backgroundColor: vars.color.background,
  width: 3,
  height: '100%',
});
