import { container } from './sidebarTitleItem.css';

export interface SidebarTitleItemProps {
  /**
   * Sidebar title content
   */
  title: string;
}

/**
 * Primary UI component for user interaction
 */
export const SidebarTitleItem = ({ title }: SidebarTitleItemProps) => {
  return <div className={container}>{title}</div>;
};
