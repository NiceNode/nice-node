import { style } from '@vanilla-extract/css';
import { vars } from './Generics/redesign/theme.css';

export const dragWindowContainer = style({
  WebkitUserSelect: 'none',
  '-webkit-app-region': 'drag',
  height: 30,
  width: '100vw',
  position: 'absolute',
  top: 0,
  zIndex: 100,
  cursor: 'grab',
  '&:hover': {
    background: vars.color.background92,
    opacity: 0.3,
  },
});
