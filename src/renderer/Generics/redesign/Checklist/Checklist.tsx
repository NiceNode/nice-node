import { container } from './checklist.css.ts';
import ChecklistItem from './ChecklistItem';

/**
 * Primary UI component for user interaction
 */
export const Checklist = (props: any) => {
  return (
    <div className={container} {...props}>
      <p>Check this list!</p>
      <ChecklistItem />
      <ChecklistItem />
      <ChecklistItem />
    </div>
  );
};
