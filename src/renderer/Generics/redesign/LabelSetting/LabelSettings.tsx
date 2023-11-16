import {
  titleFont,
  columnContainerStyle,
  columnItemStyle,
} from './labelSettings.css';
import LineLabelSettingsItem, {
  LabelSettingsSectionProps,
} from './LabelValuesSection';

export interface LineLabelSettingsProps {
  /**
   * The items in the LineLabelSettings
   */
  items: LabelSettingsSectionProps[];
  /**
   * Title of the LineLabelSettings
   */
  title?: string;
  /**
   * Column mode?
   */
  column?: boolean;
  type?: string;
  flow?: string;
}

/**
 * Rows of labels and inputs used for settings screens
 */
const LineLabelSettings = ({
  title,
  items,
  column,
  type,
  flow,
}: LineLabelSettingsProps) => {
  let columnDiv = '';
  let columnContainer = '';
  if (column) {
    columnDiv = columnItemStyle;
    columnContainer = columnContainerStyle;
  }
  return (
    <>
      {title && <div className={titleFont}>{title}</div>}
      <div className={columnContainer}>
        {items &&
          items.map((item, index) => (
            // Settings section ordering does not change during view of modal
            // eslint-disable-next-line react/no-array-index-key
            <div className={columnDiv} key={index}>
              <LineLabelSettingsItem flow={flow} type={type} {...item} />
            </div>
          ))}
      </div>
    </>
  );
};
export default LineLabelSettings;
