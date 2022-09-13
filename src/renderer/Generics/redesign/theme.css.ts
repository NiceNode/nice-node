import { createThemeContract, createTheme, style } from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    font: null,
    font10: null,
    font50: null,
    font70: null,
    background: null,
    green: null,
    yellow: null,
    red: null,
  },
});

export const lightTheme = createTheme(vars, {
  color: {
    font: 'rgba(0, 0, 2, 0.85)',
    font10: 'rgba(0, 0, 2, 0.10)',
    font50: 'rgba(0, 0, 2, 0.50)',
    font70: 'rgba(0, 0, 2, 0.70)',
    background: 'rgba(255, 255, 255, 1)',
    green: 'rgba(62, 187, 100, 1)',
    yellow: 'rgba(251, 146, 65, 1)',
    red: 'rgba(235, 83, 76, 1)',
  },
});

export const darkTheme = createTheme(vars, {
  color: {
    font: 'rgba(255, 255, 255, 0.85)',
    font10: 'rgba(255, 255, 255, 0.10)',
    font50: 'rgba(255, 255, 255, 0.50)',
    font70: 'rgba(255, 255, 255, 0.70)',
    background: 'rgba(28, 28, 30, 1)',
    green: 'rgba(62, 187, 100, 1)',
    yellow: 'rgba(251, 146, 65, 1)',
    red: 'rgba(235, 83, 76, 1)',
  },
});

// export const brandText = style({
//   color: vars.color.font,
//   background: vars.color.background,
// });
