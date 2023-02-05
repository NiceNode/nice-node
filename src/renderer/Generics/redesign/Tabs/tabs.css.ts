import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// required to export even if not using in a component
export const container = style({});

export const tabsContainer = style({
  selectors: {
    '&.modal': {
      position: 'sticky',
      top: 0,
      backgroundColor: vars.color.background,
      zIndex: 1,
    },
  },
});

export const tabsList = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 24,
  height: 28,
  alignItems: 'center',
  padding: '10px 0',
  selectors: {
    '&.modal': {
      paddingLeft: 32,
    },
  },
});

export const tabContent = style({
  paddingTop: 36,
  selectors: {
    '&.modal': {
      overflow: 'auto',
      // extra padding from scrollbar
      padding: '36px 32px 64px 32px',
      height: 474,
      width: 720,
    },
  },
});
