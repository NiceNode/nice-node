import { style } from '@vanilla-extract/css';
import { vars, common } from '../../Generics/redesign/theme.css';

export const container = style({
  position: 'relative',
  maxWidth: '100%',
  width: 'inherit',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  background: vars.color.background,
});

export const logsScroller = style({
  padding: '7px 17px 0px 17px',
  position: 'relative',
  flexGrow: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column-reverse',
});

export const filterContainer = style({
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  padding: '8px 16px',
  gap: 4,
  background: vars.components.filterBackground,
  borderBottom: vars.components.contentHeaderBorderBottom,
  boxShadow: vars.color.elevation2boxShadow,
  zIndex: 1,
});

export const textFilterContainer = style({
  width: 200,
});

export const filterMenu = style({
  position: 'absolute',
  top: 34,
  zIndex: 1,
});

export const typeFilterContainer = style({
  minWidth: 158,
  position: 'relative',
  textAlign: 'left',
});

export const timeframeFilterContainer = style({
  minWidth: 148,
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

export const noResultsContainer = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const contentContainer = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  width: 520,
});

export const titleFont = style({
  fontWeight: 590,
  fontSize: 15,
  lineHeight: '20px',
  color: vars.color.font,
  letterSpacing: '-0.24px',
  textAlign: 'center',
  marginBottom: 8,
});

export const descriptionFont = style({
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  color: vars.color.font70,
  letterSpacing: '-0.08px',
  marginBottom: 24,
});
