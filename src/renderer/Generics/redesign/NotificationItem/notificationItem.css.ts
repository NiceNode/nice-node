import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '16px 0px 16px 10px',
  gap: '12px',
  width: 'auto',
  borderBottom: vars.components.clientCardBorder,
});

export const selectedContainer = style({
  background: vars.color.background96,
  borderRadius: '4px',
});

export const iconContainer = style({
  flex: 'none',
  order: '0',
  flexGrow: '0',
});

export const textContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '2px',
  // width: '172px',
  height: '32px',
  flex: 'none',
  order: '1',
  flexGrow: '1',
});

export const rowContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
});

export const dateStyle = style({
  fontWeight: '400',
  fontSize: '11px',
  lineHeight: '14px',
  color: vars.color.font50,
});

export const titleStyle = style({
  order: '0',
  flex: 'none',
  alignSelf: 'stretch',
  flexGrow: '0',
  fontWeight: '510',
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.12px',
  color: vars.color.font85,
});

export const infoStyle = style({
  order: 1,
  flex: 'none',
  alignSelf: 'stretch',
  flexGrow: 0,
  fontWeight: '400',
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.08px',
  color: vars.color.font70,
});
