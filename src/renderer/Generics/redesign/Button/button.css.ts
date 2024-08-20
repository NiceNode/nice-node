import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const baseButton = style({
  cursor: 'pointer',
  userSelect: 'none',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 12px',
  gap: 6,
  border: '1px solid',
  borderRadius: 5,
  borderColor: vars.color.font10,
  ':disabled': {
    color: vars.color.fontDisabled,
    background: vars.color.backgroundDisabled,
    cursor: 'not-allowed',
  },
  fontWeight: 500,
  fontSize: 13,
  lineHeight: '16px',
  height: '32px',
  selectors: {
    '&.small': {
      padding: '6px 10px',
      height: '28px',
      gap: '6px',
    },
    '&.small.icon': {
      padding: 6,
    },
    '&.medium.icon': {
      padding: 8,
    },
    '&.wide': {
      width: '100%',
    },
    '&.spaceBetween': {
      justifyContent: 'space-between',
    },
  },
});

export const ghostButton = style({
  background: 'none',
  border: 'none',
  boxShadow: 'none',
  color: vars.color.font,
  selectors: {
    '&:hover:enabled': {
      background: vars.color.backgroundHoverGradient,
    },
    '&:active:enabled': {
      background: vars.color.backgroundActiveGradient,
    },
  },
});

export const primaryButton = style({
  color: common.color.white100,
  background: vars.color.primary,
  selectors: {
    '&:hover:enabled': {
      background: vars.color.primaryHover,
    },
    '&:active:enabled': {
      background: vars.color.primaryActive,
    },
  },
});

export const secondaryButton = style([
  {
    color: vars.color.font,
    background: vars.components.secondaryButtonBackground,
    boxShadow: vars.components.buttonBoxShadow,
    selectors: {
      '&:hover:enabled': {
        background: vars.color.backgroundHoverGradient,
      },
      '&:active:enabled': {
        background: vars.color.backgroundActiveGradient,
      },
    },
  },
]);

export const dangerButton = style({
  color: common.color.white100,
  background: common.color.red500,
  selectors: {
    '&:hover:enabled': {
      background: common.color.red600,
    },
    '&:active:enabled': {
      background: common.color.red600,
    },
  },
});

export const iconLeft = style({
  order: 1,
});

export const iconStyle = style({
  width: 16,
  height: 16,
});
