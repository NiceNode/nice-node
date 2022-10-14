import { style } from '@vanilla-extract/css';
import { vars, common } from '../theme.css';

export const container = style({
  boxSizing: 'border-box',
  width: 348,
  height: 280,
  background: vars.components.clientCardBackground,
  border: vars.components.clientCardBorder,
  boxShadow: vars.components.clientCardBoxShadow,
  borderRadius: 12,
  overflow: 'hidden',
});

export const cardTop = style({
  height: 166,
  position: 'relative',
  backgroundSize: 'cover',
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
  color: common.color.white,
  textShadow: '0px 1px 2px rgba(0, 0, 0, 0.06)',
});

export const cardContent = style({
  padding: 20,
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
