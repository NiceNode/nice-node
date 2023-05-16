import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const wrapper = style({
  width: '100%',
});

export const container = style({
  width: '100%',
  display: 'flex',
  marginBottom: '10px',
  border: '1px solid rgba(0, 0, 2, 0.1)',
  borderRadius: '4px',
  boxSizing: 'border-box',
});

export const section = style({
  height: '30px',
});

export const other = style({
  backgroundColor: 'lightgray',
});

export const client = style({
  backgroundColor: 'red',
});

export const free = style({
  backgroundColor: 'transparent',
});

export const legendContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

export const legend = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  textAlign: 'center',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '11px',
  lineHeight: '14px',
  gap: '8px',
});

export const labelContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

export const label = style({
  color: 'rgba(0, 0, 2, 0.7)',
});

export const size = style({
  color: 'rgba(0, 0, 2, 0.4)',
});

export const colorBox = style({
  width: '15px',
  height: '15px',
  marginBottom: '5px',
  border: '1px solid rgba(0, 0, 2, 0.08)',
  borderRadius: '4px',
  boxSizing: 'border-box',
});

export const otherColorBox = style({
  extend: colorBox,
  backgroundColor: 'lightgray',
});

export const freeColorBox = style({
  extend: colorBox,
  backgroundColor: 'transparent',
});
