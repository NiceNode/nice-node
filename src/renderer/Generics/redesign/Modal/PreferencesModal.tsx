import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import PreferencesWrapper from 'renderer/Presentational/Preferences/PreferencesWrapper';
import electron from 'renderer/electronGlobal';
import { Modal } from './Modal';
import { ModalConfig } from './ModalManager';

type Props = {
  modalOnClose: () => void;
};

export const PreferencesModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState({});
  const { t } = useTranslation('genericComponents');
  const modalTitle = t('Preferences');
  const buttonSaveLabel = 'Save changes';

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    const { theme, isOpenOnStartup } =
      updatedConfig || (modalConfig as ModalConfig);

    if (theme) {
      await electron.setThemeSetting(theme);
    }
    if (isOpenOnStartup) {
      await electron.setIsOpenOnStartup(isOpenOnStartup);
    }
    modalOnClose();
  };

  const modalOnChangeConfig = async (config: ModalConfig, save?: boolean) => {
    let updatedConfig = {};
    const keys = Object.keys(config);
    if (keys.length > 1) {
      updatedConfig = {
        ...modalConfig,
        ...config,
      };
    } else {
      const key = keys[0];
      updatedConfig = {
        ...modalConfig,
        [key]: config[key],
      };
    }
    setModalConfig(updatedConfig);
    if (save) {
      await modalOnSaveConfig(updatedConfig);
    }
  };

  return (
    <Modal
      modalTitle={modalTitle}
      buttonSaveLabel={buttonSaveLabel}
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={modalOnClose}
    >
      <PreferencesWrapper modalOnChangeConfig={modalOnChangeConfig} />
    </Modal>
  );
};
