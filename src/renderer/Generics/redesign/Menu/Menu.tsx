import { IconId } from 'renderer/assets/images/icons';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';
import { Icon } from '../Icon/Icon';
import { MenuItem } from '../MenuItem/MenuItem';
import { container } from './menu.css';

export interface MenuProps {
  /**
   * What's the width?
   */
  width: number;
  /**
   * Menu Items?
   */
  children?: React.ReactNode;
}

/**
 * Primary UI component for user interaction
 */
export const Menu = ({ width, children }: MenuProps) => {
  return (
    <div style={{ width }} className={container}>
      <MenuItem
        text="Restart Client"
        onClick={() => {
          console.log('Restart Client');
        }}
      />
      <MenuItem
        text="Check for Updates..."
        onClick={() => {
          console.log('Check for Updates...');
        }}
      />
      <HorizontalLine type="menu" />
      <MenuItem
        text="Client Versions"
        onClick={() => {
          console.log('Client Versions');
        }}
      />
      <HorizontalLine type="menu" />
      <MenuItem
        text="Switch Client"
        onClick={() => {
          console.log('Switch Client');
        }}
        disabled
      />
      {/* {children} */}
    </div>
  );
};
