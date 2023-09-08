import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const activeContainer = style({});

export const container = style({
  height: '56px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
});

export const iconContainer = style({
  // Todo: setting filter as a value causes the element to appear at the "top" of the visual
  //  stack. More here https://stackoverflow.com/questions/52937708/why-does-applying-a-css-filter-on-the-parent-break-the-child-positioning
  // filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.04))',
  filter: 'none',
});

export const textContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingLeft: '24px',
  gap: '6px',
  flex: 'none',
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
  height: '28px',
  gap: '5px',
});

export const menuButtonContainer = style({
  position: 'relative',
});

export const popupContainer = style({
  position: 'absolute',
  top: 32,
  right: 0,
});
