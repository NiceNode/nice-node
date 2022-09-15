import React from 'react';
import { container } from './checklist.css';
import ChecklistItem, { ChecklistItemProps } from './ChecklistItem';
import HorizontalLine from '../HorizontalLine/HorizontalLine';

export interface ChecklistProps {
  /**
   * The items in the checklist
   */
  items: ChecklistItemProps[];
  /**
   * Title of the checklist
   */
  title?: string;
}

/**
 * Primary UI component for user interaction
 */
export const Checklist = ({ title, items }: ChecklistProps) => {
  return (
    <div className={container}>
      <h2>{title}</h2>
      {items &&
        items.map((item) => (
          <React.Fragment key={item.checkTitle}>
            <ChecklistItem {...item} />
            <HorizontalLine />
          </React.Fragment>
        ))}
    </div>
  );
};
