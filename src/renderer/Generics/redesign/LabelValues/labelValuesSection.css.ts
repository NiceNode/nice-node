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
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '8px 0px',
  gap: '28px',
  flex: 'none',
  order: 1,
  alignSelf: 'stretch',
  flexGrow: 0,
  borderBottom: '1px solid',
  borderColor: vars.color.font10,
});
export const lineKeyText = style({
  color: vars.color.font70,
  flex: 'none',
  order: 0,
  flexGrow: 0,
  // todo: possible fix for long name or link which needs ellipse'd
  // max-width: 50%;
  // text-overflow: ellipsis;
  // overflow: hidden;
  // white-space: nowrap;
});

export const lineValueText = style({
  color: vars.color.font70,
  flex: 'none',
  order: 1,
  flexGrow: 0,
});
