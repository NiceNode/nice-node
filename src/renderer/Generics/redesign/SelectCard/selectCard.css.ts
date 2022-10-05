import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const activeContainer = style({});

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
  position: 'relative',
  background: vars.color.background96,
  ':hover': { background: vars.color.background92 },
});

export const selectedContainer = style({
  selectors: {
    [`${activeContainer} &`]: {
      borderWidth: '5px',
      background: vars.components.selectCardBackground,
      boxShadow: vars.components.selectCardBoxShadow,
    },
    [`${activeContainer} &:before`]: {
      content: '',
      position: 'absolute',
      width: '-webkit-fill-available',
      left: '0',
      top: '0',
      height: '-webkit-fill-available',
      border: '2px solid #7a64ee',
      borderRadius: '5px',
    },
  },
});

export const textContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '2px',
  minHeight: '100%',
  justifyContent: 'center',
  order: 0,
  flexGrow: 1,
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
