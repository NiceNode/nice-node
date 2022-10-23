import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const activeContainer = style({});

export const container = style({
  height: '56px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  position: 'relative',
});

export const iconContainer = style({
  flex: 'none',
  order: '0',
  flexGrow: '0',
  filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.04))',
});

export const textContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingLeft: '24px',
  gap: '6px',
  flex: 'none',
  order: '1',
  flexGrow: '1',
});

export const titleContainer = style({
  order: '0',
  flex: 'none',
  flexGrow: '0',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
});

export const titleStyle = style({
  alignSelf: 'stretch',
  fontStyle: 'normal',
  fontWeight: '590',
  fontSize: '32px',
  lineHeight: '100%',
  textTransform: 'capitalize',
  color: vars.color.font,
});

export const versionContainer = style({
  boxSizing: 'border-box',
  padding: '5px 8px',
  border: vars.components.versionBorder,
  borderRadius: '50px',
  color: vars.color.font50,
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

export const buttonContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  position: 'absolute',
  height: '28px',
  right: '0px',
  top: '3px',
  gap: '5px',
});

export const updateCallout = style({
  position: 'absolute',
  right: 118,
  top: 32,
});
