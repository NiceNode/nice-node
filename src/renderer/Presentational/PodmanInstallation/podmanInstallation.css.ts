import { style } from '@vanilla-extract/css';
import { common, vars } from '../../Generics/redesign/theme.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingBottom: 15,
  selectors: {
    '&.modal': {
      width: 560,
    },
  },
});

export const titleFont = style({
  fontWeight: 500,
  fontSize: 32,
  lineHeight: '32px',
  letterSpacing: '-0.01em',
  marginBottom: 16,
});

export const descriptionFont = style({
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  color: vars.color.font70,
  marginBottom: 8,
});

export const captionText = style({
  paddingTop: 4,
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font50,
});

export const learnMore = style({
  marginBottom: 32,
});

export const installContentContainer = style({
  width: '100%',
});

export const installationContainer = style({
  borderColor: vars.color.border,
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: '16px 16px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 25,
});

export const installationIcon = style({
  width: 33,
  height: 33,
  color: common.color.green500,
  marginBottom: 12,
});

export const installationComplete = style({
  marginBottom: 4,
  fontWeight: 590,
  fontSize: '13px',
  lineHeight: '16px',
  /* identical to box height, or 123% */

  letterSpacing: '-0.12px',
});

export const installationSteps = style({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '11px',
  lineHeight: '14px',
  color: vars.color.font50,
});
