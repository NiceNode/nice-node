import { createTheme } from '@vanilla-extract/css';

export const common = {
  color: {
    white: '#FFFFFF',
    white4: 'rgba(255, 255, 255, 0.04)',
    white25: 'rgba(255, 255, 255, 0.25)',
    black4: 'rgba(0, 0, 2, 0.04)',
    black25: 'rgba(0, 0, 2, 0.25)',
    primary700: '#5A37D7',
  },
};

export const [lightTheme, vars] = createTheme({
  color: {
    font: 'rgba(0, 0, 2, 0.85)',
    font10: 'rgba(0, 0, 2, 0.10)',
    font25: 'rgba(0, 0, 2, 0.25)',
    font50: 'rgba(0, 0, 2, 0.50)',
    font70: 'rgba(0, 0, 2, 0.70)',
    fontDisabled: common.color.black25,
    background: common.color.white,
    background96: 'rgba(0, 0, 2, 0.04)',
    background92: 'rgba(0, 0, 2, 0.08)',
    backgroundActiveGradient:
      'linear-gradient(0deg, rgba(0, 0, 2, 0.04), rgba(0, 0, 2, 0.04)), #FFFFFF',
    backgroundDisabled: common.color.black4,
    border: 'rgba(0, 0, 2, 0.10)',
    border15: 'rgba(0, 0, 2, 0.15)',
    primary: '#7351EB',
    primaryHover: '#482EB6',
    green: 'rgba(62, 187, 100, 1)',
    yellow: 'rgba(251, 146, 65, 1)',
    red: 'rgba(235, 83, 76, 1)',
  },
  components: {
    buttonBoxShadow: '0px 1px 2px rgba(0, 0, 0, 0.08)',
    selectCardBackground: 'rgba(115, 81, 235, 0.08)',
    selectCardBoxShadow: 'inset 0px 0px 0px 4px rgba(255, 255, 255, 0.08)',
    secondaryButtonBackground: common.color.white,
  },
});

export const darkTheme = createTheme(vars, {
  color: {
    font: 'rgba(255, 255, 255, 0.85)',
    font10: 'rgba(255, 255, 255, 0.10)',
    font25: 'rgba(255, 255, 255, 0.25)',
    font50: 'rgba(255, 255, 255, 0.50)',
    font70: 'rgba(255, 255, 255, 0.70)',
    fontDisabled: common.color.white25,
    background: 'rgba(28, 28, 30, 1)',
    background96: common.color.white4,
    background92: 'rgba(255, 255, 255, 0.08)',
    backgroundActiveGradient:
      'linear-gradient(0deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04)), #000000',
    backgroundDisabled: common.color.white4,
    border: 'rgba(255, 255, 255, 0.1)',
    border15: 'rgba(255, 255, 255, 0.15)',
    primary: '#8267EF',
    primaryHover: '#998FF1',
    green: 'rgba(62, 187, 100, 1)',
    yellow: 'rgba(251, 146, 65, 1)',
    red: 'rgba(235, 83, 76, 1)',
  },
  components: {
    buttonBoxShadow: '0px 1px 2px rgba(0, 0, 0, 0.24)',
    selectCardBackground: 'rgba(130, 103, 239, 0.08)',
    selectCardBoxShadow: 'none',
    secondaryButtonBackground: common.color.white4,
  },
});
