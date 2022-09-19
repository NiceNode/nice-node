import React from 'react';
import { titleFont } from './labelValues.css';
import LineLabelValuesItem, {
  LabelValuesSectionProps,
} from './LabelValuesSection';

export interface LineLabelValuesProps {
  /**
   * The items in the LineLabelValues
   */
  items: LabelValuesSectionProps[];
  /**
   * Title of the LineLabelValues
   */
  title?: string;
}

/**
 * Primary UI component for user interaction
 */
const LineLabelValues = ({ title, items }: LineLabelValuesProps) => {
  return (
    <div>
      <div className={titleFont}>{title}</div>
      {items &&
        items.map((item) => (
          <React.Fragment key={item.sectionTitle}>
            <LineLabelValuesItem {...item} />
          </React.Fragment>
        ))}
    </div>
  );
};
export default LineLabelValues;
