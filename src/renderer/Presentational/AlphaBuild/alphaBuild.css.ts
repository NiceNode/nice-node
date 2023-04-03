import { style } from '@vanilla-extract/css';
import { common } from 'renderer/Generics/redesign/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  width: 380,
});

export const topBanner = style({
  height: 92,
  backgroundColor: common.color.pink100,
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  display: 'flex',
  justifyContent: 'center',
});

export const contentContainer = style({
  padding: '24px 24px 0px 24px',
  gap: 24,
  display: 'flex',
  flexDirection: 'column',
});

export const contentSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  fontSize: 13,
  fontWeight: 400,
  lineHeight: '18px',
  letterSpacing: '-0.08px',
});

export const contentMajorTitle = style({
  fontWeight: 590,
  fontSize: 20,
  lineHeight: '24px',
  letterSpacing: '-0.4px',
});

export const contentTitle = style({
  fontWeight: 590,
});
