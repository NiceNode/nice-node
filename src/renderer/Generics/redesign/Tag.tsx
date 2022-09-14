export interface TagProps {
  /**
   * Tag label
   */
  label: string;
  /**
   * Tag type
   */
  type?: 'pink' | 'pink2' | 'green';
}

/**
 * Primary UI component for user interaction
 */
export const Tag = ({ label, type }: TagProps) => {
  return (
    <div className={['storybook-tag', `${type}`].join(' ')}>
      <div>{label}</div>
    </div>
  );
};
