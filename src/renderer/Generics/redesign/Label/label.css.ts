import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

// required to export even if not using in a component
export const container = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '4px 10px',
  gap: '4px',
  fontWeight: 400,
  borderRadius: '14px',
  fontSize: '11px',
  lineHeight: '14px',
  flex: 'none',
  order: 0,
  flexGrow: 0,
  width: 'fit-content',
  selectors: {
    '&.bold': {
      fontWeight: 590,
    },
    '&.small': {
      padding: '2px 6px',
      gap: '10px',
    },
    '&.green': {
      background: vars.components.labelGreenBackground,
      color: vars.components.labelGreenFontColor,
    },
    '&.red': {
      background: vars.components.labelRedBackground,
      color: vars.components.labelRedFontColor,
    },
    '&.gray': {
      background: vars.components.labelGrayBackground,
      color: vars.components.labelGrayFontColor,
    },
    '&.pink': {
      background: vars.components.labelPinkBackground,
      color: vars.components.labelPinkFontColor,
    },
    '&.purple': {
      background: vars.components.labelPurpleBackground,
      color: vars.components.labelPurpleFontColor,
    },
    '&.orange': {
      background: vars.components.labelOrangeBackground,
      color: vars.components.labelOrangeFontColor,
    },
    '&.pink2': {
      background: vars.components.labelPink2Background,
      color: vars.components.labelPink2FontColor,
    },
  },
});
