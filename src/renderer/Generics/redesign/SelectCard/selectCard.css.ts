import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  margin: 5,
  cursor: 'pointer',
  minWidth: 200,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '10px 12px',
  gap: '12px',
  borderRadius: '5px',
  boxShadow: vars.components.selectCardBoxShadow,
  background: vars.color.background96,
  ':hover': { background: vars.color.background92 },
});

export const selectedContainer = style({
  border: '2px solid #7a64ee',
  background: vars.components.selectCardBackground,
  ':hover': { background: vars.components.selectCardBackground },
});

export const textContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '2px',
  height: '100%',
  justifyContent: 'center',
  flex: 'none',
  order: 0,
  flexGrow: 0,
});

export const titleStyle = style({
  order: 0,
  flex: 'none',
  alignSelf: 'stretch',
  flexGrow: 0,
  fontWeight: 600,
  // color: 'rgba(0, 0, 2, 0.85)',
});

export const descriptionStyle = style({
  order: 1,
  flex: 'none',
  alignSelf: 'stretch',
  flexGrow: 0,
  fontWeight: 400,
  color: vars.color.font70,
});

export const tagStyle = style({
  marginLeft: 'auto',
});
