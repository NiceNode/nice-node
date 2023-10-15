import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const container = style({
  boxSizing: 'border-box',
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '4px 0px',
  gap: 8,
  borderBottom: `1px solid ${vars.color.background96}`,
  flex: 'none',
  order: 2,
  alignSelf: 'stretch',
  flexGrow: 0,
  transform: 'translateZ(0)',

  color: vars.color.font90,
  fontFamily: `'SF Mono', SFMono-Regular, ui-monospace,
  'DejaVu Sans Mono', Menlo, Consolas, monospace`,
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '11px',
  lineHeight: '14px',
  letterSpacing: '0.24px',
});

export const timestampStyle = style({
  width: 113,
  // width: 133,  for including milliseconds
  flex: 'none',
  order: 1,
  flexGrow: 0,
});

export const levelStyle = style({
  textTransform: 'uppercase',
  width: 35,
  flex: 'none',
  order: 2,
  flexGrow: 0,
  selectors: {
    [`&.INFO`]: {
      color: common.color.blue600,
    },
    [`&.WARN`]: {
      color: common.color.orange500,
    },
    [`&.ERROR`]: {
      color: common.color.red500,
    },
  },
});

export const messageStyle = style({
  order: 3,
  flexGrow: 1,
  overflowWrap: 'anywhere',
});

export const copyStyle = style({
  display: 'none',
  position: 'absolute',
  selectors: {
    [`${container}:hover &`]: {
      display: 'block',
      right: 0,
    },
  },
});
