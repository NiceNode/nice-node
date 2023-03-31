import { useTranslation } from 'react-i18next';

import LineLabelSettings from '../../Generics/redesign/LabelSetting/LabelSettings';
import { Toggle } from '../../Generics/redesign/Toggle/Toggle';
import LanguageSelect from '../../LanguageSelect';
import {
  preferencesContainer,
  captionText,
  selectedThemeImage,
  themeImage,
} from './preferences.css';
import DarkModeThumbnail from '../../assets/images/artwork/DarkModeThumbnail.png';
import LightModeThumbnail from '../../assets/images/artwork/LightModeThumbnail.png';
import AutoDarkLightModeThumbnail from '../../assets/images/artwork/AutoDarkLightModeThumbnail.png';
import { lineKeyText } from '../../Generics/redesign/LabelSetting/labelSettingsSection.css';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference =
  | 'theme'
  | 'isOpenOnStartup'
  | 'isNotificationsEnabled'
  | 'isEventReportingEnabled';
export interface PreferencesProps {
  themeSetting?: ThemeSetting;
  isOpenOnStartup?: boolean;
  isNotificationsEnabled?: boolean;
  isEventReportingEnabled?: boolean;
  version?: string;
  onChange?: (preference: Preference, value: unknown) => void;
}

const Preferences = ({
  themeSetting,
  isOpenOnStartup,
  isNotificationsEnabled,
  isEventReportingEnabled,
  version,
  onChange,
}: PreferencesProps) => {
  const { t } = useTranslation('genericComponents');

  const onClickTheme = (theme: ThemeSetting) => {
    if (onChange) {
      onChange('theme', theme);
    }
  };

  return (
    <div className={preferencesContainer}>
      <span className={lineKeyText}>{t('Appearance')}</span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          paddingBottom: 24,
          paddingTop: 12,
        }}
      >
        {[
          {
            theme: 'auto',
            thumbnail: AutoDarkLightModeThumbnail,
            label: t('AutoFollowsComputerSetting'),
          },
          {
            theme: 'light',
            thumbnail: LightModeThumbnail,
            label: t('LightMode'),
          },
          {
            theme: 'dark',
            thumbnail: DarkModeThumbnail,
            label: t('DarkMode'),
          },
        ].map((themeDetails, index) => {
          const isSelected = themeSetting === themeDetails.theme;
          const imgClassNames = [themeImage];
          if (isSelected) {
            imgClassNames.push(selectedThemeImage);
          }
          return (
            <div
              key={themeDetails.theme}
              role="button"
              tabIndex={index}
              style={{ display: 'flex', flexDirection: 'column' }}
              onClick={() => onClickTheme(themeDetails.theme as ThemeSetting)}
              onKeyDown={() => onClickTheme(themeDetails.theme as ThemeSetting)}
            >
              <img
                src={themeDetails.thumbnail}
                alt={themeDetails.theme}
                className={imgClassNames.join(' ')}
              />
              <span className={captionText}>{themeDetails.label}</span>
            </div>
          );
        })}
      </div>
      <HorizontalLine />
      <LineLabelSettings
        items={[
          {
            sectionTitle: '',
            items: [
              {
                label: t('LaunchOnLogin'),
                value: (
                  <Toggle
                    onText="Enabled"
                    offText="Disabled"
                    checked={isOpenOnStartup}
                    onChange={(newValue) => {
                      if (onChange) {
                        onChange('isOpenOnStartup', newValue);
                      }
                    }}
                  />
                ),
              },
              {
                label: 'Desktop notifications',
                value: (
                  <Toggle
                    onText="Enabled"
                    offText="Disabled"
                    checked={isNotificationsEnabled}
                    onChange={(newValue) => {
                      if (onChange) {
                        onChange('isNotificationsEnabled', newValue);
                      }
                    }}
                  />
                ),
              },
              {
                label: `Event reporting`,
                description: `(${process.env.FATHOM_SITE_ENV} ${process.env.FATHOM_SITE_ID})`,
                value: (
                  <Toggle
                    onText="Enabled"
                    offText="Disabled"
                    checked={isEventReportingEnabled}
                    onChange={(newValue) => {
                      if (onChange) {
                        onChange('isEventReportingEnabled', newValue);
                      }
                    }}
                  />
                ),
              },
              {
                label: t('Language'),
                value: <LanguageSelect />,
              },
            ],
          },
        ]}
      />
      <span className={captionText}>{version}</span>
      <br />
      <span className={captionText}>{process.env.NICENODE_ENV}</span>
    </div>
  );
};

export default Preferences;
