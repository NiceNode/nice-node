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
  zIndex: 3,
  bottom: 16,
  position: 'absolute',
  borderRadius: 20,
  borderColor: vars.color.font10,
  fontWeight: 500,
  fontSize: 13,
  lineHeight: '16px',
  height: '32px',
  color: common.color.white100,
  boxShadow: vars.color.elevation3boxShadow,
  background: vars.color.font70,
  left: 'calc(50% - 155px/2 - 0.5px)',
  selectors: {
    '&:hover:enabled': {
      background: vars.color.font85,
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
