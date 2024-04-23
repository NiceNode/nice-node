import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ThemeSetting } from '../../../main/state/settings';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import electron from '../../electronGlobal';
import {
  reportEvent,
  setRemoteEventReportingEnabled,
} from '../../events/reportEvent';
import { useGetSettingsQuery } from '../../state/settingsService';
import PreferencesWrapper from '../Preferences/PreferencesWrapper';
import { type ModalConfig, modalOnChangeConfig } from './modalUtils';

type Props = {
  modalOnClose: () => void;
};

interface MetaElement extends HTMLMetaElement {
  content: ThemeSetting;
}

export const PreferencesModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const { t } = useTranslation();
  const modalTitle = t('Preferences');
  const buttonSaveLabel = t('SaveChanges');
  const qSettings = useGetSettingsQuery();

  const handleColorSchemeChange = (colorScheme: ThemeSetting) => {
    const meta = document.querySelector(
      'meta[name="color-scheme"]',
    ) as MetaElement;
    const colorValue = colorScheme === 'auto' ? 'light dark' : colorScheme;
    if (meta) meta.content = colorValue as ThemeSetting;
  };

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    const {
      theme,
      isOpenOnStartup,
      isNotificationsEnabled,
      isEventReportingEnabled,
      isPreReleaseUpdatesEnabled,
      language,
    } = updatedConfig || (modalConfig as ModalConfig);

    if (theme) {
      await electron.setThemeSetting(theme);
      handleColorSchemeChange(theme);
    }
    if (isOpenOnStartup !== undefined) {
      await electron.setIsOpenOnStartup(isOpenOnStartup);
    }
    if (isNotificationsEnabled !== undefined) {
      await electron.getSetIsNotificationsEnabled(isNotificationsEnabled);
    }
    if (isEventReportingEnabled !== undefined) {
      await electron.setIsEventReportingEnabled(isEventReportingEnabled);
      await setRemoteEventReportingEnabled(isEventReportingEnabled);
    }
    if (isPreReleaseUpdatesEnabled !== undefined) {
      await electron.getSetIsPreReleaseUpdatesEnabled(
        isPreReleaseUpdatesEnabled,
      );
      if (isPreReleaseUpdatesEnabled) {
        reportEvent('EnablePreReleaseUpdates');
      } else {
        reportEvent('DisablePreReleaseUpdates');
      }
    }
    if (language) {
      await electron.setLanguage(language);
      qSettings.refetch();
    }
    modalOnClose();
  };

  return (
    <Modal
      modalTitle={modalTitle}
      buttonSaveLabel={buttonSaveLabel}
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={modalOnClose}
      modalOnCancel={modalOnClose}
    >
      <PreferencesWrapper
        modalOnChangeConfig={(config, save) => {
          modalOnChangeConfig(
            config,
            modalConfig,
            setModalConfig,
            save,
            modalOnSaveConfig,
          );
        }}
      />
    </Modal>
  );
};
