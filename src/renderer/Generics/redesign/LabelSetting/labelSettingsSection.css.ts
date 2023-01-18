import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const sectionContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '8px 0px',
});
export const sectionHeaderContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '8px 0px',
  gap: '28px',
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
});
export const sectionHeaderText = style({
  fontWeight: 'bold',
  fontSize: 10,
  lineHeight: '12px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: vars.color.font40,
});
export const lineContainer = style({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: '48px',
  padding: '8px 0px',
  columnGap: '14px',
  rowGap: '8px',
  flex: 'none',
  order: 1,
  alignSelf: 'stretch',
  flexGrow: 0,
  borderBottom: '1px solid',
  borderColor: vars.color.font10,
});

export const labelAndDescriptionContainer = style({
  display: 'flex',
  gap: 4,
  flexDirection: 'column',
  flex: 'none',
  order: 0,
  flexGrow: 0,
  maxWidth: '100%',
});

export const lineKeyText = style({
  fontWeight: 590,
  color: vars.color.font70,
  letterSpacing: '-0.12px',
});

export const lineValueText = style({
  color: vars.color.font70,
  flex: 'none',
  order: 1,
  flexGrow: 0,
});
