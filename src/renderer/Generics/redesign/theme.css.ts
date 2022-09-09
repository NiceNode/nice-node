import { createThemeContract, createTheme, style } from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    font: null,
    background: null,
  },
});

export const lightTheme = createTheme(vars, {
  color: {
    font: '#000',
    background: '#FFF',
  },
});

export const darkTheme = createTheme(vars, {
  color: {
    font: '#FFF',
    background: '#000',
  },
});

// export const brandText = style({
//   color: vars.color.font,
//   background: vars.color.background,
// });
