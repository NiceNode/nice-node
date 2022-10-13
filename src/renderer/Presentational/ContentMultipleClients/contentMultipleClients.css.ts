import { style } from '@vanilla-extract/css';
import { vars } from '../../Generics/redesign/theme.css';

export const container = style({
  margin: '64px 40px',
  width: 720,
  boxSizing: 'border-box',
});

export const sectionTitle = style({
  fontWeight: 590,
  fontSize: '20px',
  lineHeight: '100%',
  letterSpacing: '-0.4px',
  marginBottom: 20,
});

export const sectionDescription = style({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 13,
  lineHeight: '18px',
  letterSpacing: '-0.08px',
  color: vars.color.font50,
});

export const clientCardsContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: 0,
  gap: 24,
});

export const horizontalLine = style({
  padding: '0 20px',
});
