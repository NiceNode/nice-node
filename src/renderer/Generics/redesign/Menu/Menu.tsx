import { container } from './menu.css';

export interface MenuProps {
  /**
   * What's the width?
   */
  width?: number;
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
      {children}
    </div>
  );
};
