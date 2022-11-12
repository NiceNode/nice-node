import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const container = style({
  position: 'relative',
});

export const contentHeader = style({
  position: 'absolute',
  width: '100%',
  background: 'white',
  height: 52,
  zIndex: 1,
});

export const logsContainer = style({
  paddingTop: 52,
  position: 'relative',
});

export const filterContainer = style({
  width: '100%',
  position: 'absolute',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '8px 16px',
  gap: 4,
  background: common.color.white100,
  borderBottom: `1px solid rgba(0, 0, 0, 0.08)`,
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
});
export const timeframeFilterContainer = style({
  width: 148,
  position: 'relative',
});
