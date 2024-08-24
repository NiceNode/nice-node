import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NodePackage } from '../../../common/node';
import type { ModalConfig } from '../ModalManager/modalUtils';
import {
  container,
  statusContainer,
  statusIcon,
  successIcon,
  loadingIcon,
  statusText,
  statusButton,
} from './update.css';
import { UpdateCallout } from '../../Generics/redesign/UpdateCallout/UpdateCallout.js';
import Button from '../../Generics/redesign/Button/Button.js';
import { Icon } from '../../Generics/redesign/Icon/Icon.js';

export interface UpdateProps {
  deeplink?: string;
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
  modalOnClose: () => void;
}

const Update = ({
  updateStatus,
  modalOnChangeConfig,
  modalOnClose,
  deeplink,
}: UpdateProps) => {
  const [view, setView] = useState<string>(deeplink);
  const { t } = useTranslation();

  const UpdateStatus = () => {
    const iconClass = successIcon;
    const iconId = 'checkcirclefilled';
    const status = 'Checking for updates...';
    const buttonLabel = 'Close';
    return (
      <div className={statusContainer}>
        <div className={statusIcon}>
          <div className={iconClass}>
            <Icon iconId={iconId} />
          </div>
        </div>
        <div className={statusText}>{status}</div>
        <div className={statusButton}>
          <Button
            type={'secondary'}
            size={'small'}
            label={buttonLabel}
            wide={true}
            onClick={modalOnClose}
          />
        </div>
      </div>
    );
  };

  let test = null;
  if (view === 'check') {
    test = UpdateStatus();
  } else if (view === 'update') {
    test = <div>test</div>;
  }

  return <div className={container}>{test}</div>;
};

export default Update;
