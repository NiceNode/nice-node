import { createTheme } from '@vanilla-extract/css';

export const [lightTheme, vars] = createTheme({
  color: {
    font: 'rgba(0, 0, 2, 0.85)',
    font10: 'rgba(0, 0, 2, 0.10)',
    font50: 'rgba(0, 0, 2, 0.50)',
    font70: 'rgba(0, 0, 2, 0.70)',
    background: 'rgba(255, 255, 255, 1)',
    primary: '#7351EB',
    primaryHover: '#482EB6',
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
    primary: '#8267EF',
    primaryHover: '#998FF1',
    green: 'rgba(62, 187, 100, 1)',
    yellow: 'rgba(251, 146, 65, 1)',
    red: 'rgba(235, 83, 76, 1)',
  },
});
