export interface BubbleProps {
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * Button contents
   */
  count: number;
}

/**
 * Primary UI component for user interaction
 */
export const Bubble = ({ backgroundColor, count, ...props }: BubbleProps) => {
  return (
    <div
      className={['storybook-bubble'].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {count}
    </div>
  );
};
