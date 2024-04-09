import React from 'react';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';
import { Icon } from '../Icon/Icon';
import ChecklistItem, { type ChecklistItemProps } from './ChecklistItem';
import { container, iconComponent, iconContainer } from './checklist.css';

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

export const Checklist = ({ title, items }: ChecklistProps) => {
  if (items.length === 0) {
    return (
      <div className={iconContainer}>
        <div className={iconComponent}>
          <Icon iconId="syncing" />
        </div>
      </div>
    );
  }
  return (
    <div className={container}>
      {title && <h2>{title}</h2>}
      {items?.map((item, index) => (
        <React.Fragment key={item.checkTitle}>
          <ChecklistItem {...item} />
          {index !== items.length - 1 && <HorizontalLine />}
        </React.Fragment>
      ))}
    </div>
  );
};
