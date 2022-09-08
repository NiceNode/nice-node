import { container } from './checklist.css.ts';

/**
 * Primary UI component for user interaction
 */
export const Checklist = (props: any) => {
  return (
    <div className={container} {...props}>
      <p>Check this list!</p>
    </div>
  );
};
