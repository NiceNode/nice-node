import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const baseButton = style({
  cursor: 'pointer',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 12px',
  gap: '10px',
  border: '1px solid',
  borderRadius: 5,
  borderColor: vars.color.font10,
  ':disabled': {
    color: vars.color.fontDisabled,
    background: vars.color.backgroundDisabled,
  },
  // offsets legacy value in app.css
  ':hover': {
    transform: 'none',
  },
  fontWeight: 500,
  fontSize: 13,
  lineHeight: '16px',
  height: '32px',
});

export const smallButton = style({
  padding: '6px 10px',
  height: '28px',
  gap: '6px',
});

export const primaryButton = style([
  {
    color: common.color.white,
    background: vars.color.primary,
    selectors: {
      '&:hover:enabled': {
        background: vars.color.primaryHover,
      },
      '&:active:enabled': {
        background: common.color.primary700,
      },
    },
  },
]);

export const secondaryButton = style([
  {
    color: vars.color.font,
    background: vars.components.secondaryButtonBackground,
    boxShadow: vars.components.buttonBoxShadow,
    selectors: {
      '&:hover:enabled': {
        background: vars.color.background92,
      },
      '&:active:enabled': {
        background: vars.color.backgroundActiveGradient,
      },
    },
  },
]);

export const iconLeft = style({
  order: 1,
});
