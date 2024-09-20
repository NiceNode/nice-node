import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const checkboxContainer = style({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  gap: 8,
  color: vars.color.font,
  selectors: {
    '&.disabled': {
      color: vars.color.fontDisabled,
      cursor: 'not-allowed',
    },
  },
});

export const checkboxLabel = style({
  cursor: 'pointer',
});

export const checkboxInput = style({
  opacity: 0, // Hide the default checkbox
  position: 'absolute', // Remove it from the layout
  pointerEvents: 'none', // Disable interaction
});

export const customCheckbox = style({
  width: 16,
  height: 16,
  display: 'inline-block',
  position: 'relative',
  backgroundColor: vars.components.checkboxBackground,
  border: `1px solid ${vars.components.checkboxBorder}`,
  borderRadius: 4, // Rounded corners for the checkbox
});

export const svgCheckmark = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

export const svgIndeterminate = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

export const checkedCustomCheckbox = style({
  backgroundColor: vars.components.toggleCheckedBackground, // Purple background when checked
  borderColor: vars.components.toggleCheckedBackground,
  color: common.color.white100,
});

export const indeterminateCustomCheckbox = style({
  backgroundColor: vars.components.toggleCheckedBackground, // Purple background when indeterminate
  borderColor: vars.components.toggleCheckedBackground,
  color: common.color.white100,
});

export const disabledCheckbox = style({
  backgroundColor: vars.components.disabledBackground, // Light gray background when disabled
  borderColor: vars.color.font8, // Light gray border when disabled
  cursor: 'not-allowed',
  color: vars.color.border15,
});
