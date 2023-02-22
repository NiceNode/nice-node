import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import PreferencesWrapper from 'renderer/Presentational/Preferences/PreferencesWrapper';
import electron from 'renderer/electronGlobal';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { modalOnChangeConfig, ModalConfig } from './modalUtils';

type Props = {
  modalOnClose: () => void;
};

export const PreferencesModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
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

  return (
    <Modal
      modalTitle={modalTitle}
      buttonSaveLabel={buttonSaveLabel}
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={modalOnClose}
    >
      <PreferencesWrapper
        modalOnChangeConfig={(config, save) => {
          modalOnChangeConfig(
            config,
            modalConfig,
            setModalConfig,
            save,
            modalOnSaveConfig
          );
        }}
      />
    </Modal>
  );
};
