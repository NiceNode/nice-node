import { ModalConfig } from './ModalManager';

const modalOnChangeConfig = async (
  config: ModalConfig,
  modalConfig: ModalConfig,
  setModalConfig: React.Dispatch<React.SetStateAction<ModalConfig>>,
  save?: boolean,
  modalOnSaveConfig?: (config: ModalConfig) => Promise<void>
) => {
  if (!setModalConfig || !modalConfig) {
    throw new Error('modal config is not defined');
  }

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

  if (save && modalOnSaveConfig) {
    await modalOnSaveConfig(updatedConfig);
  }
};

export default modalOnChangeConfig;
