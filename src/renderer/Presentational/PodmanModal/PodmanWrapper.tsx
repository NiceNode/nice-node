import { useCallback } from "react";
import type { ModalConfig } from "../ModalManager/modalUtils.js";
import PodmanInstallation from "../PodmanInstallation/PodmanInstallation.tsx";

export interface PodmanWrapperProps {
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
  disableSaveButton: (value: boolean) => void;
}

const PodmanWrapper = ({
  modalOnChangeConfig,
  disableSaveButton,
}: PodmanWrapperProps) => {
  const onChangeDockerInstall = useCallback((newValue: string) => {
    if (newValue === "done") {
      disableSaveButton(false);
    }
  }, []);

  return (
    <PodmanInstallation
      disableSaveButton={disableSaveButton}
      onChange={onChangeDockerInstall}
    />
  );
};

export default PodmanWrapper;
