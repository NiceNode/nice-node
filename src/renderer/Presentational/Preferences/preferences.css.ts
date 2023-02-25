import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const preferencesContainer = style({
  paddingBottom: 32,
});

export const captionText = style({
  paddingTop: 4,
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font50,
});

export const themeImage = style({
  cursor: 'pointer',
  maxHeight: 112,
  maxWidth: 165,
  padding: 2,
  borderRadius: 5,
  border: '2px solid none',
});

export const selectedThemeImage = style({
  cursor: 'pointer',
  maxHeight: 112,
  maxWidth: 165,
  padding: 2,
  borderRadius: 5,
  border: `2px solid ${vars.color.primary}`,
});
