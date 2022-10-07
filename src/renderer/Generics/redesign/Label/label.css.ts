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
  borderRadius: '14px',
  fontSize: '11px',
  lineHeight: '14px',
  flex: 'none',
  order: 0,
  flexGrow: 0,
  width: 'fit-content',
  selectors: {
    [`&.pink`]: {
      background: vars.components.tagPinkBackground,
      color: vars.components.tagPinkFontColor,
    },
    [`&.pink2`]: {
      background: vars.components.tagPink2Background,
      color: vars.components.tagPink2FontColor,
    },
    [`&.green`]: {
      background: vars.components.tagGreenBackground,
      color: vars.components.tagGreenFontColor,
    },
  },
});
