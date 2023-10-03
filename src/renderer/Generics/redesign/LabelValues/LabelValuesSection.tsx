import React from 'react';
import ExternalLink from '../Link/ExternalLink';
import {
  sectionContainer,
  lineContainer,
  lineKeyText,
  lineValueText,
  sectionHeaderContainer,
  sectionHeaderText,
} from './labelValuesSection.css';

export interface LabelValuesSectionItemsProps {
  /**
   * The sections label value items
   */
  label: string;
  value: string;
  link?: string;
}

export interface LabelValuesSectionProps {
  /**
   * Title gets uppercased
   */
  sectionTitle: string;
  /**
   * The sections label value items
   */
  items: LabelValuesSectionItemsProps[];
}

const LabelValuesSection = ({
  sectionTitle,
  items,
}: LabelValuesSectionProps) => {
  const renderValue = (item: {
    label: string;
    value: string;
    link?: string;
  }) => {
    const value = item.link ? (
      <ExternalLink url={item.link} text={item.value} />
    ) : (
      item.value
    );
    return <div className={lineValueText}>{value}</div>;
  };
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
              {renderValue(item)}
            </div>
          </React.Fragment>
        ))}
    </div>
  );
};

export default LabelValuesSection;
