import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const container = style({
  color: vars.color.primary,
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  gap: '4px',
  fontSize: '13px',
  lineHeight: '16px',
  letterSpacing: '-0.08px',
  selectors: {
    '&.small': {
      fontWeight: 400,
      fontSize: '11px',
      lineHeight: '14px',
    },
  },
});

export const inlineContainer = style([container, { display: 'inline-flex' }]);
export const blockContainer = style([container, { display: 'flex' }]);

export const linkText = style({
  color: vars.color.primaryLink,
  letterSpacing: '-0.08px',
  textDecoration: 'none',
  selectors: {
    '&.underline': {
      textDecoration: 'underline',
    },
  },
  ':hover': {
    color: vars.color.primaryLinkHover,
    textDecoration: 'none',
  },
  ':link': {
    textDecoration: 'none',
  },
  ':visited': {
    textDecoration: 'none',
  },
});

export const dangerLinkText = style({
  color: vars.color.dangerLink,
  letterSpacing: '-0.08px',
  textDecoration: 'none',
  selectors: {
    '&.underline': {
      textDecoration: 'underline',
    },
  },
  ':hover': {
    color: vars.color.dangerLinkHover,
    textDecoration: 'none',
  },
  ':link': {
    textDecoration: 'none',
  },
  ':visited': {
    textDecoration: 'none',
  },
});

export const iconStyle = style({
  width: 14,
  height: 14,
  selectors: {
    '&.small': {
      width: 12,
      height: 12,
    },
  },
});
