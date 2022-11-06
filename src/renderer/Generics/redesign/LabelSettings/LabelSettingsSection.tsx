import React, { ReactElement } from 'react';
import ExternalLink from '../Link/ExternalLink';
import {
  sectionContainer,
  lineContainer,
  lineKeyText,
  lineValueText,
  sectionHeaderContainer,
  sectionHeaderText,
} from './labelSettingsSection.css';

export interface LabelSettingsSectionProps {
  /**
   * Title gets uppercased
   */
  sectionTitle: string;
  /**
   * The sections label value items
   */
  items: { label: string; value: ReactElement | string; link?: string }[];
}

const LabelSettingsSection = ({
  sectionTitle,
  items,
}: LabelSettingsSectionProps) => {
  const renderValue = (item: {
    label: string;
    value: ReactElement | string;
    link?: string;
  }) => {
    const value = item.link ? (
      <ExternalLink url={item.link} text={item.value.toString()} />
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

export default LabelSettingsSection;
