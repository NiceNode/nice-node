import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../Generics/redesign/Modal/Modal.js";
import electron from "../../electronGlobal.js";
import { reportEvent } from "../../events/reportEvent.js";
import PodmanWrapper from "../PodmanModal/PodmanWrapper.js";
import { type ModalConfig, modalOnChangeConfig } from "./modalUtils.js";

type Props = {
  modalOnClose: () => void;
};

export const PodmanModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const { t } = useTranslation();
  const buttonSaveLabel = t("Done");

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    try {
      console.log("set some kind of setting here?");
    } catch (err) {
      console.error(err);
      throw new Error(
        "There was an error removing the node. Try again and please report the error to the NiceNode team in Discord.",
      );
    }
    modalOnClose();
  };

  const disableSaveButton = useCallback((value: boolean) => {
    setIsSaveButtonDisabled(value);
  }, []);

  return (
    <Modal
      modalType="modal"
      modalStyle="podman"
      buttonSaveLabel={buttonSaveLabel}
      isSaveButtonDisabled={isSaveButtonDisabled}
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={modalOnClose}
      modalOnCancel={modalOnClose}
    >
      <PodmanWrapper
        modalOnChangeConfig={(config, save) => {
          modalOnChangeConfig(
            config,
            modalConfig,
            setModalConfig,
            save,
            modalOnSaveConfig,
          );
        }}
        disableSaveButton={disableSaveButton}
      />
    </Modal>
  );
};
