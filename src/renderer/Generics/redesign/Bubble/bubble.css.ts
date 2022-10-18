import { style } from '@vanilla-extract/css';
import { common, vars } from '../theme.css';

export const container = style({
  flex: 'none',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '2px 6px',
  gap: '10px',
  fontStyle: 'normal',
  fontWeight: '590',
  fontSize: '11px',
  lineHeight: '14px',
  textAlign: 'center',
  color: '#FFFFFF',
  maxWidth: 'fit-content',
  background: common.color.red500,
  borderRadius: '9px',
});
