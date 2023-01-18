import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const container = style({
  boxSizing: 'border-box',
  cursor: 'pointer',
  width: '50%',
  height: 280,
  background: vars.components.clientCardBackground,
  border: vars.components.clientCardBorder,
  boxShadow: vars.components.clientCardBoxShadow,
  borderRadius: 12,
  overflow: 'hidden',
  backdropFilter: 'blur(0)',
  transform: 'translate3d(0, 0, 0)',
  ':hover': {
    boxShadow: 'none',
  },
});

export const cardTop = style({
  height: 166,
  position: 'relative',
  backgroundSize: 'cover',
  selectors: {
    [`&.stopped`]: {
      opacity: 0.64,
    },
  },
});

export const clientDetails = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 0,
  gap: 14,
  position: 'absolute',
  left: 22,
  bottom: 22,
});

export const clientIcon = style({});

export const clientTitle = style({
  fontWeight: 590,
  fontSize: '28px',
  lineHeight: '100%',
  color: common.color.white100,
  textShadow: '0px 1px 2px rgba(0, 0, 0, 0.06)',
  textTransform: 'capitalize',
});

export const cardContent = style({
  padding: 20,
});

export const clientBackground = style({
  height: '100%',
  width: '100%',
  backdropFilter: 'blur(20px)',
  transform: 'translate3d(0, 0, 0)',
  background: vars.components.clientCardTopBackground,
  selectors: {
    [`&.stopped`]: {
      background: common.color.white4,
    },
  },
  ':hover': {
    backdropFilter: 'blur(28px)',
    transform: 'translate3d(0, 0, 0)',
    background: vars.components.clientCardTopBackgroundHover,
  },
});

export const clientType = style({
  textTransform: 'uppercase',
  fontStyle: 'normal',
  fontWeight: 590,
  fontSize: '11px',
  lineHeight: '12px',
  letterSpacing: '0.24px',
  color: vars.color.font40,
  marginBottom: 12,
});

export const clientLabels = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 4,
});
