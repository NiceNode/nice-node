import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const container = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '4px 0px',
  gap: 8,
  borderBottom: '1px solid rgba(0, 0, 2, 0.04)',
  flex: 'none',
  order: 2,
  alignSelf: 'stretch',
  flexGrow: 0,

  color: common.color.black90,
  fontFamily: `'SF Mono', SFMono-Regular, ui-monospace,
  'DejaVu Sans Mono', Menlo, Consolas, monospace`,
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '11px',
  lineHeight: '14px',

  letterSpacing: '0.24px',
});

export const infoStyle = style({
  color: common.color.black25,
});

export const timestampStyle = style({
  width: 133,
  flex: 'none',
  order: 1,
  flexGrow: 0,
});

export const typeStyle = style({
  textTransform: 'uppercase',
  width: 35,
  flex: 'none',
  order: 2,
  flexGrow: 0,
  selectors: {
    [`&.info`]: {
      color: common.color.blue600,
    },
    [`&.warn`]: {
      color: common.color.orange500,
    },
    [`&.error`]: {
      color: common.color.red500,
    },
  },
});

export const messageStyle = style({
  flex: 'none',
  order: 3,
  flexGrow: 1,
});
