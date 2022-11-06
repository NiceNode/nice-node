import { useTranslation } from 'react-i18next';

import { Modal } from '../../Generics/redesign/Modal/Modal';
import LineLabelSettings from '../../Generics/redesign/LabelSetting/LabelSettings';
import { Toggle } from '../../Generics/redesign/Toggle/Toggle';
import Select from '../../Generics/redesign/Select/Select';
// eslint-disable-next-line import/no-cycle
import LanguageSelect from '../../LanguageSelect';
import { captionText } from './preferences.css';
import DarkModeThumbnail from '../../assets/images/artwork/DarkModeThumbnail.png';
import LightModeThumbnail from '../../assets/images/artwork/LightModeThumbnail.png';
import AutoDarkLightModeThumbnail from '../../assets/images/artwork/AutoDarkLightModeThumbnail.png';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference = 'theme' | 'isOpenOnStartup';
export interface PreferencesProps {
  isOpen: boolean;
  onClose: () => void;
  themeSetting?: ThemeSetting;
  isOpenOnStartup?: boolean;
  version?: string;
  onChange?: (preference: Preference, value: unknown) => void;
}

const Preferences = ({
  isOpen,
  onClose,
  themeSetting,
  isOpenOnStartup,
  version,
  onChange,
}: PreferencesProps) => {
  const { t } = useTranslation('genericComponents');

  return (
    <Modal
      isOpen={isOpen}
      title={t('Preferences')}
      onClickCloseButton={onClose}
    >
      {/* <span>Appearance</span> */}
      <LineLabelSettings
        items={[
          {
            sectionTitle: t('Appearance'),
            items: [
              {
                label: t('ThemeColor'),
                value: (
                  <Select
                    value={themeSetting}
                    onChange={(newValue) => {
                      if (onChange) {
                        onChange('theme', newValue);
                      }
                    }}
                    options={[
                      {
                        value: 'auto',
                        label: t('AutoFollowsComputerSetting'),
                      },
                      { value: 'light', label: t('LightMode') },
                      { value: 'dark', label: t('DarkMode') },
                    ]}
                  />
                ),
              },
            ],
          },
          {
            sectionTitle: '',
            items: [
              {
                label: t('LaunchOnStartup'),
                value: (
                  <Toggle
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
                value: <LanguageSelect />,
              },
            ],
          },
        ]}
      />
      <span className={captionText}>NiceNode version {version}</span>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
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
        ].map((themeDetails) => {
          return (
            <div
              style={{ display: 'flex', flexDirection: 'column' }}
              onClick={() => {
                if (onChange) {
                  onChange('theme', themeDetails.theme);
                }
              }}
            >
              <img
                src={themeDetails.thumbnail}
                alt={themeDetails.theme}
                style={{
                  cursor: 'pointer',
                  maxHeight: 112,
                  maxWidth: 165,
                  padding: 2,
                  borderRadius: 5,
                  border:
                    themeSetting === themeDetails.theme
                      ? '1px solid purple'
                      : 'none',
                }}
              />
              <span className={captionText}>{themeDetails.label}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default Preferences;
