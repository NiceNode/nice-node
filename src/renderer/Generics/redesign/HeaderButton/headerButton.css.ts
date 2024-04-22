import { type ComplexStyleRule, style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  boxSizing: 'border-box',
  flex: 'none',
  '-webkit-app-region': 'no-drag',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 5,
  gap: 10,
  width: 28,
  height: 28,
  borderRadius: 5,
  zIndex: 4,
  color: vars.color.font,
  ':hover': {
    backgroundColor: vars.components.headerButtonHover,
  },
  ':active': {
    backgroundColor: vars.components.headerButtonActive,
  },
  selectors: {
    '&.toggled': {
      color: vars.color.primaryActive,
      backgroundColor: vars.components.headerButtonHover,
    },
  },
} as ComplexStyleRule); // fix for lacking '-webkit-app-region' type
