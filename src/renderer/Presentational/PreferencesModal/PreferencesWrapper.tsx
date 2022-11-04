import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '../../Generics/redesign/Modal/Modal';
import Preferences from './Preferences';

export interface PreferencesWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  themeSetting: 'light' | 'dark' | 'auto';
  isOpenOnStartup: boolean;
  language: string;
  version: string;
}

const PreferencesWrapper = ({
  isOpen,
  onClose,
  themeSetting,
  isOpenOnStartup,
  language,
  version,
}: PreferencesWrapperProps) => {
  const { t } = useTranslation();

  // make electron calls for os and user settings
  return (
    <Preferences
      isOpen={isOpen}
      title={t('PreferencesWrapper')}
      onClickCloseButton={onClose}
    />
  );
};

export default PreferencesWrapper;
