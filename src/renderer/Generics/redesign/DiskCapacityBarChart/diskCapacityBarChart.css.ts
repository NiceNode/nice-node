import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const wrapper = style({
  width: '100%',
});

export const container = style({
  width: '100%',
  display: 'flex',
  marginBottom: 15,
  boxSizing: 'border-box',
});

export const section = style({
  height: '30px',
});

export const other = style({
  backgroundColor: 'lightgray',
  borderStyle: 'solid',
  borderWidth: '1px 0 1px 1px' /* top right bottom left */,
  borderRadius: '4px 0 0 4px',
  borderColor: vars.color.border,
});

export const client = style({
  backgroundColor: 'red',
  borderStyle: 'solid',
  borderWidth: '1px 0 1px 0px' /* top right bottom left */,
  borderRadius: '0 0 0 0',
  borderColor: vars.color.border,
});

export const free = style({
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderWidth: '1px 1px 1px 0px' /* top right bottom left */,
  borderRadius: '0 4px 4px 0',
  borderColor: vars.color.border,
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
  color: vars.color.font70,
});

export const size = style({
  color: vars.color.font40,
});

export const colorBox = style({
  width: '15px',
  height: '15px',
  marginBottom: '5px',
  border: `1px solid ${vars.color.border}`,
  borderRadius: '4px',
  boxSizing: 'border-box',
  selectors: {
    '&.other': {
      backgroundColor: 'lightgray',
    },
    '&.free': {
      backgroundColor: 'transparent',
    },
  },
});
