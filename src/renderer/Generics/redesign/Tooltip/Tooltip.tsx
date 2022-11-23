import { container, titleStyle, contentStyle } from './tooltip.css';

export interface TooltipProps {
  /**
   * What's the title?
   */
  title: string;
  /**
   * Is there content?
   */
  content?: string;
}

/**
 * Primary UI component for user interaction
 */
export const Tooltip = ({ title, content }: TooltipProps) => {
  return (
    <div className={container}>
      <div className={titleStyle}>{title}</div>
      <div className={contentStyle}>{content}</div>
    </div>
  );
};
