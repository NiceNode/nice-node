import LineLabelSettingsItem, {
  type LabelSettingsSectionProps,
} from './LabelValuesSection';
import {
  columnContainerStyle,
  columnItemStyle,
  titleFont,
} from './labelSettings.css';

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
}

/**
 * Rows of labels and inputs used for settings screens
 */
const LineLabelSettings = ({
  title,
  items,
  column,
  type,
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
        {items?.map((item, index) => (
          // Settings section ordering does not change during view of modal
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div className={columnDiv} key={index}>
            <LineLabelSettingsItem type={type} {...item} />
          </div>
        ))}
      </div>
    </>
  );
};
export default LineLabelSettings;
