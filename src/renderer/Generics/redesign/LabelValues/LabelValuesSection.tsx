import React from 'react';
import {
  sectionContainer,
  lineContainer,
  lineKeyText,
  lineValueText,
  sectionHeaderContainer,
  sectionHeaderText,
} from './labelValuesSection.css';

export interface LabelValuesSectionProps {
  /**
   * Title gets uppercased
   */
  sectionTitle: string;
  /**
   * The sections label value items
   */
  items: { label: string; value: string }[];
}

const LabelValuesSection = ({
  sectionTitle,
  items,
}: LabelValuesSectionProps) => {
  return (
    <div className={sectionContainer}>
      <div className={sectionHeaderContainer}>
        <div className={sectionHeaderText}>{sectionTitle}</div>
      </div>
      {items &&
        items.map((item) => (
          <React.Fragment key={item.label + item.value}>
            <div className={lineContainer}>
              <div className={lineKeyText}>{item.label}</div>
              <div className={lineValueText}>{item.value}</div>
            </div>
          </React.Fragment>
        ))}
    </div>
  );
};

export default LabelValuesSection;
