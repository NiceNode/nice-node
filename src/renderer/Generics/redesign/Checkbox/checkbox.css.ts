import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 0,
  gap: 8,
  color: vars.color.font,
  selectors: {
    '&.disabled': {
      color: vars.color.fontDisabled,
    },
  },
});

export const checkbox = style({
  accentColor: vars.components.checkboxBackground,
  border: `1px solid ${vars.components.checkboxBorder}`,
  borderRadius: 4,
  width: 16,
  height: 16,
  fontSize: 10,
  margin: 0,
  ':checked': {
    accentColor: vars.components.toggleCheckedBackground,
  },
  ':disabled': {
    pointerEvents: 'none',
    filter: 'none',
    opacity: '0.5',
  },
});
