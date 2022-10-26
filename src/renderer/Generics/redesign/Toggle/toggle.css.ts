import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

const url =
  'url("data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27><circle r=%273%27 fill=%27%23fff%27/></svg>")';

// required to export even if not using in a component
export const container = style({
  height: '16px',
  width: '30px',
  backgroundRepeat: 'no-repeat',
  backgroundImage: url,
  backgroundPosition: '0',
  transition: 'background-position 0.15s ease-in-out',
  backgroundColor: vars.components.toggleBackground,
  borderRadius: '9999px',
  appearance: 'none',
  ':checked': {
    backgroundColor: vars.components.toggleCheckedBackground,
    backgroundPosition: '100%',
  },
  ':disabled': {
    pointerEvents: 'none',
    filter: 'none',
    opacity: '0.5',
  },
});
