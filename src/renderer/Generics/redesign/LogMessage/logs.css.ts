import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const container = style({
  position: 'relative',
  maxWidth: '100%',
  width: 'inherit',
});

export const contentHeader = style({
  position: 'fixed',
  maxWidth: 'inherit',
  width: 'inherit',
  zIndex: 1,
});

export const logsContainer = style({
  padding: '52px 17px 0px 17px',
  position: 'relative',
});

export const filterContainer = style({
  width: '100%',
  position: 'absolute',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  padding: '8px 16px',
  gap: 4,
  background: vars.components.filterBackground,
  borderBottom: vars.components.contentHeaderBorderBottom,
  boxShadow: vars.color.elevation2boxShadow,
});

export const textFilterContainer = style({
  width: 200,
});

export const filterMenu = style({
  position: 'absolute',
  top: 34,
});

export const typeFilterContainer = style({
  width: 158,
  position: 'relative',
  textAlign: 'left',
});

export const timeframeFilterContainer = style({
  width: 148,
  position: 'relative',
});

export const spacer = style({
  alignSelf: 'stretch',
  flexGrow: 1,
});

export const clearFilters = style({
  cursor: 'pointer',
  color: common.color.purple600,
});
