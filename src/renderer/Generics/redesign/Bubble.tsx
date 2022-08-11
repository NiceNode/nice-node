export interface BubbleProps {
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * Button contents
   */
  label: string | number;
}

/**
 * Primary UI component for user interaction
 */
export const Bubble = ({ backgroundColor, label, ...props }: BubbleProps) => {
  return (
    <div
      className={['storybook-bubble'].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </div>
  );
};
