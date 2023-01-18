import {
  titleFont,
  columnContainerStyle,
  columnItemStyle,
} from './labelValues.css';
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
  /**
   * Column mode?
   */
  column?: boolean;
}

/**
 * Primary UI component for user interaction
 */
const LineLabelValues = ({ title, items, column }: LineLabelValuesProps) => {
  let columnDiv = '';
  let columnContainer = '';
  if (column) {
    columnDiv = columnItemStyle;
    columnContainer = columnContainerStyle;
  }
  return (
    <>
      <div className={titleFont}>{title}</div>
      <div className={columnContainer}>
        {items &&
          items.map((item) => (
            <div className={columnDiv} key={item.sectionTitle}>
              <LineLabelValuesItem {...item} />
            </div>
          ))}
      </div>
    </>
  );
};
export default LineLabelValues;
