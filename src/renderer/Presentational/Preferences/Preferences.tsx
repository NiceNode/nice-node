import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import { Icon } from '../../Generics/redesign/Icon/Icon';
import LineLabelSettings from '../../Generics/redesign/LabelSetting/LabelSettings';
import { Toggle } from '../../Generics/redesign/Toggle/Toggle';
import LanguageSelect from '../../LanguageSelect';
import AutoDark from '../../assets/images/artwork/auto-dark.png';
import AutoLight from '../../assets/images/artwork/auto-light.png';
import DarkDark from '../../assets/images/artwork/dark-dark.png';
import DarkLight from '../../assets/images/artwork/dark-light.png';
import LightDark from '../../assets/images/artwork/light-dark.png';
import LightLight from '../../assets/images/artwork/light-light.png';
import {
  appearanceSection,
  captionText,
  preferenceSection,
  preferencesContainer,
  sectionTitle,
  selectedThemeContainer,
  selectedThemeImage,
  themeCircleBackground,
  themeCircleContainer,
  themeCircleIcon,
  themeContainer,
  themeImage,
  themeInnerContainer,
  versionContainer,
} from './preferences.css';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference =
  | 'theme'
  | 'isOpenOnStartup'
  | 'isNotificationsEnabled'
  | 'isEventReportingEnabled'
  | 'isPreReleaseUpdatesEnabled'
  | 'isDeveloperModeEnabled'
  | 'language';
export interface PreferencesProps {
  themeSetting?: ThemeSetting;
  isOpenOnStartup?: boolean;
  osDarkMode?: boolean;
  isNotificationsEnabled?: boolean;
  isEventReportingEnabled?: boolean;
  isPreReleaseUpdatesEnabled?: boolean;
  isDeveloperModeEnabled?: boolean;
  version?: string;
  language?: string;
  onChange?: (preference: Preference, value: unknown) => void;
}

const Preferences = ({
  themeSetting,
  isOpenOnStartup,
  osDarkMode,
  isNotificationsEnabled,
  isEventReportingEnabled,
  isPreReleaseUpdatesEnabled,
  isDeveloperModeEnabled,
  version,
  language,
  onChange,
}: PreferencesProps) => {
  const { t } = useTranslation();
  const [initialThemeSetting] = useState(themeSetting);

  const onClickTheme = (theme: ThemeSetting) => {
    if (onChange) {
      onChange('theme', theme);
    }
  };

  const getThemeThumbnail = (theme: ThemeSetting) => {
    const lightTheme = initialThemeSetting === 'light';
    switch (theme) {
      case 'auto':
        return !osDarkMode || initialThemeSetting === 'light'
          ? AutoLight
          : AutoDark;
      case 'light':
        return lightTheme ? LightLight : LightDark;
      case 'dark':
        return lightTheme ? DarkLight : DarkDark;
      default:
    }
    return AutoLight;
  };

  return (
    <div className={preferencesContainer}>
      <div className={sectionTitle}>{t('Appearance')}</div>
      <div className={appearanceSection}>
        {[
          {
            theme: 'auto',
            label: t('AutoFollowsComputerSetting'),
          },
          {
            theme: 'light',
            label: t('LightMode'),
          },
          {
            theme: 'dark',
            label: t('DarkMode'),
          },
        ].map((themeDetails, index) => {
          const isSelected = themeSetting === themeDetails.theme;
          const selectedStyle = [themeInnerContainer];
          const imgClassNames = [themeImage, themeDetails.theme];
          if (isSelected) {
            imgClassNames.push(selectedThemeImage);
            selectedStyle.push(selectedThemeContainer);
          }
          const thumbnail = getThemeThumbnail(
            themeDetails.theme as ThemeSetting,
          );
          return (
            <div
              key={themeDetails.theme}
              // biome-ignore lint: useSemanticElements
              role="button"
              tabIndex={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
              onClick={() => onClickTheme(themeDetails.theme as ThemeSetting)}
              onKeyDown={() => onClickTheme(themeDetails.theme as ThemeSetting)}
            >
              <div className={themeContainer}>
                {isSelected && (
                  <div className={themeCircleContainer}>
                    <div className={themeCircleIcon}>
                      <Icon iconId="checkcirclefilled" />
                    </div>
                    <div className={themeCircleBackground} />
                  </div>
                )}
                <div className={selectedStyle.join(' ')}>
                  <img
                    src={thumbnail}
                    alt={themeDetails.label}
                    className={imgClassNames.join(' ')}
                  />
                </div>
              </div>
              <span className={captionText}>{themeDetails.label}</span>
            </div>
          );
        })}
      </div>
      <div className={preferenceSection}>
        <div className={sectionTitle}>{t('General')}</div>
        <HorizontalLine />
        <LineLabelSettings
          items={[
            {
              sectionTitle: '',
              items: [
                {
                  label: t('LaunchOnStartup'),
                  value: (
                    <Toggle
                      onText={t('Enabled')}
                      offText={t('Disabled')}
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
                  label: t('Language'),
                  value: (
                    <LanguageSelect
                      language={language}
                      onChange={(newValue) => {
                        if (onChange) {
                          onChange('language', newValue);
                        }
                      }}
                    />
                  ),
                },
              ],
            },
          ]}
        />
      </div>
      <div className={preferenceSection}>
        <div id="notifications" className={sectionTitle}>
          {t('Notifications')}
        </div>
        <HorizontalLine />
        <LineLabelSettings
          items={[
            {
              sectionTitle: '',
              items: [
                {
                  label: t('DesktopNotifications'),
                  value: (
                    <Toggle
                      onText={t('Enabled')}
                      offText={t('Disabled')}
                      checked={isNotificationsEnabled}
                      onChange={(newValue) => {
                        if (onChange) {
                          onChange('isNotificationsEnabled', newValue);
                        }
                      }}
                    />
                  ),
                },
              ],
            },
          ]}
        />
      </div>
      <div className={preferenceSection}>
        <div className={sectionTitle}>{t('Privacy')}</div>
        <HorizontalLine />
        <LineLabelSettings
          items={[
            {
              sectionTitle: '',
              items: [
                {
                  label: t('SendErrorEventReports'),
                  description: `${t('SendErrorEventReportsDescription')}`,
                  value: (
                    <Toggle
                      onText={t('Enabled')}
                      offText={t('Disabled')}
                      checked={isEventReportingEnabled}
                      onChange={(newValue) => {
                        if (onChange) {
                          onChange('isEventReportingEnabled', newValue);
                        }
                      }}
                    />
                  ),
                  learnMoreLink: 'https://impact.nicenode.xyz',
                },
              ],
            },
          ]}
        />
      </div>
      <div className={preferenceSection}>
        <div className={sectionTitle}>{t('Advanced')}</div>
        <HorizontalLine />
        <LineLabelSettings
          items={[
            {
              sectionTitle: '',
              items: [
                {
                  label: t('PreReleaseUpdates'),
                  description: t('PreReleaseUpdatesDescription'),
                  value: (
                    <Toggle
                      onText={t('Enabled')}
                      offText={t('Disabled')}
                      checked={isPreReleaseUpdatesEnabled}
                      onChange={(newValue) => {
                        if (onChange) {
                          onChange('isPreReleaseUpdatesEnabled', newValue);
                        }
                      }}
                    />
                  ),
                },
                {
                  label: `${t('Developer mode')}`,
                  description: t(
                    'Show developer information throuhout the app marked by  👷',
                  ),
                  value: (
                    <Toggle
                      onText={t('Enabled')}
                      offText={t('Disabled')}
                      checked={isDeveloperModeEnabled}
                      onChange={(newValue) => {
                        if (onChange) {
                          onChange('isDeveloperModeEnabled', newValue);
                        }
                      }}
                    />
                  ),
                },
              ],
            },
          ]}
        />
      </div>
      <div className={versionContainer}>
        {t('YouAreRunningNiceNode')} {version} {import.meta.env.NICENODE_ENV}
        {import.meta.env.MP_PROJECT_ENV}
      </div>
    </div>
  );
};

export default Preferences;
