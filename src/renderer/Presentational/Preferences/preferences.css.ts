import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const preferencesContainer = style({
  paddingBottom: 32,
});

export const captionText = style({
  paddingTop: 8,
  fontSize: 11,
  lineHeight: '14px',
  color: vars.color.font50,
});

export const appearanceSection = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
});

export const themeCircleContainer = style({
  position: 'absolute',
  top: 12,
  right: 12,
  width: 20,
  color: vars.color.primary,
});

export const themeCircleIcon = style({
  position: 'absolute',
  width: 20,
  zIndex: 2,
});

export const themeCircleBackground = style({
  backgroundColor: 'white',
  width: 8,
  height: 8,
  position: 'absolute',
  top: 6,
  right: 6,
  zIndex: 1,
});

export const themeContainer = style({
  position: 'relative',
  width: 176,
  height: 116,
});

export const themeInnerContainer = style({
  position: 'relative',
});

export const selectedThemeContainer = style({
  selectors: {
    '&:before': {
      content: '',
      position: 'absolute',
      width: '-webkit-fill-available',
      left: '0',
      top: '0',
      height: '-webkit-fill-available',
      borderRadius: '5px',
      border: `2px solid ${vars.color.primary}`,
    },
  },
});

export const themeImage = style({
  cursor: 'pointer',
  borderRadius: 5,
  border: '2px solid none',
  width: '100%',
  height: '100%',
});

export const selectedThemeImage = style({});

export const preferenceSection = style({
  marginTop: 40,
});

export const sectionTitle = style({
  fontWeight: '590',
  fontSize: '17px',
  lineHeight: '22px',
  letterSpacing: '-0.4px',
  color: vars.color.font,
  marginBottom: 16,
});
