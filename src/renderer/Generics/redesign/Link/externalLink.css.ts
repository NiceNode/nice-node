import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// required to export even if not using in a component
export const container = style({
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  gap: '4px',
  color: vars.color.primary,
  ':hover': {
    color: vars.color.primaryHover,
  },
});
export const inlineContainer = style([container, { display: 'inline-flex' }]);
export const blockContainer = style([container, { display: 'flex' }]);

export const linkText = style({
  color: vars.color.primaryLink,
  ':hover': {
    color: vars.color.primaryLinkHover,
  },
  // todo: remove when app.css is removed. Legacy fix
  margin: 0,
});
