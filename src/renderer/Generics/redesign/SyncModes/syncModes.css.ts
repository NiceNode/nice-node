import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const syncModeContainer = style({
  display: 'flex',
  flexDirection: 'row',
  color: vars.color.font85,
  gap: 12,
});

export const syncModeButton = style({
  flexGrow: 1,
  flexBasis: 0,
  maxWidth: '100%',
});

export const container = style({
  flexGrow: 1,
  flexBasis: 0,
  maxWidth: '100%',
  cursor: 'pointer',
  userSelect: 'none',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 8,
  gap: 10,
  borderRadius: '5px',
  position: 'relative',
  background: vars.color.background96,
  ':hover': { background: vars.color.background92 },
});

export const activeContainer = style({});

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
      border: `2px solid ${common.color.purple600}`,
      borderRadius: '5px',
    },
  },
});

export const syncModeInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const syncModeTitle = style({
  textTransform: 'capitalize',
  color: vars.color.font85,
  fontSize: 13,
});
export const syncModeDetails = style({
  fontSize: 11,
  color: vars.color.font50,
});
