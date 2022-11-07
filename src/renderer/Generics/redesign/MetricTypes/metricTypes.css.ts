import { style, keyframes } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const activeContainer = style({});

export const green = style({ background: common.color.green });
export const yellow = style({ background: common.color.yellow });
export const red = style({ background: common.color.red });
export const sync = style({});
export const updating = style({});
export const stopped = style({});

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(359deg)' },
});

const greenPulse = keyframes({
  '0%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(62, 187, 100, 0.7)',
  },
  '70%': {
    transform: 'scale(1)',
    boxShadow: '0 0 0 5px rgba(62, 187, 100, 0)',
  },
  '100%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(62, 187, 100, 0)',
  },
});

const yellowPulse = keyframes({
  '0%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(251, 146, 65, 0.7)',
  },
  '70%': {
    transform: 'scale(1)',
    boxShadow: '0 0 0 5px rgba(251, 146, 65, 0)',
  },
  '100%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(251, 146, 65, 0)',
  },
});

const redPulse = keyframes({
  '0%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(235, 83, 76, 0.7)',
  },
  '70%': {
    transform: 'scale(1)',
    boxShadow: '0 0 0 5px rgba(235, 83, 76, 0)',
  },
  '100%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(235, 83, 76, 0)',
  },
});

export const statusStyle = style({
  // zIndex: 1,
  animationDuration: '2s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
  transform: 'scale(0.5)',
  borderRadius: 8,
  width: 10,
  height: 10,
  selectors: {
    [`&.${green}`]: {
      animationName: greenPulse,
    },
    [`&.${yellow}`]: {
      animationName: yellowPulse,
    },
    [`&.${red}`]: {
      animationName: redPulse,
    },
    [`&.${sync}`]: {
      borderRadius: 0,
      width: 20,
      height: 20,
      animationName: rotate,
      color: vars.color.font50,
    },
    [`&.${updating}`]: {
      borderRadius: 0,
      width: 20,
      height: 20,
      animationName: rotate,
      color: vars.color.font50,
    },
    [`&.${stopped}`]: {
      transform: 'none',
      width: 20,
      height: 20,
      color: vars.color.font50,
    },
  },
});

export const container = style({
  width: 155,
  height: 38,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  flexGrow: 1,
});

export const iconContainer = style({
  display: 'flex',
  height: '20px',
  width: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  fill: vars.components.metricTypeIcon,
});

export const textContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingLeft: '12px',
  flex: 'none',
  order: '1',
  flexGrow: '1',
});

export const titleContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const titleStyle = style({
  alignSelf: 'stretch',
  fontStyle: 'normal',
  fontWeight: '590',
  fontSize: '15px',
  lineHeight: '20px',
  letterSpacing: '-0.24px',
  color: vars.color.font,
});

export const labelStyle = style({
  alignSelf: 'stretch',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.08px',
  color: vars.color.font,
});

export const versionContainer = style({
  boxSizing: 'border-box',
  padding: '5px 8px',
  border: '1px solid rgba(0, 0, 2, 0.1)',
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
