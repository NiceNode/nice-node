import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import ExternalLink from '../Link/ExternalLink';
import Caption from '../Typography/Caption';
import {
  sectionContainer,
  lineContainer,
  lineKeyText,
  lineValueText,
  sectionHeaderContainer,
  sectionHeaderText,
  labelAndDescriptionContainer,
} from './labelSettingsSection.css';

export type LabelSettingsItem = {
  label: ReactElement | string;
  value: ReactElement | string;
  description?: string;
  learnMoreLink?: string;
};
export interface LabelSettingsSectionProps {
  /**
   * Title gets uppercased
   */
  sectionTitle?: string;
  /**
   * The sections label value items
   */
  items: LabelSettingsItem[];
  type?: string;
}

const LabelSettingsSection = ({
  sectionTitle,
  items,
  type,
}: LabelSettingsSectionProps) => {
  const { t } = useTranslation('genericComponents');

  return (
    <div className={[sectionContainer, type].join(' ')}>
      {sectionTitle && (
        <div className={sectionHeaderContainer}>
          <div className={sectionHeaderText}>{sectionTitle}</div>
        </div>
      )}
      {items &&
        items.map((item) => (
          <>
            <div className={lineContainer}>
              <div className={labelAndDescriptionContainer}>
                <div className={lineKeyText}>{item.label}</div>
                <Caption>
                  {item.description}{' '}
                  {item.learnMoreLink && (
                    <ExternalLink
                      url={item.learnMoreLink}
                      text={t('LearnMore')}
                      inline
                      hideIcon
                    />
                  )}
                </Caption>
              </div>

              <div className={lineValueText}>{item.value}</div>
            </div>
          </>
        ))}
    </div>
  );
};

export default LabelSettingsSection;
