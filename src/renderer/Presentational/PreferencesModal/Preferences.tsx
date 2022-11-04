import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '../../Generics/redesign/Modal/Modal';

export interface PreferencesProps {
  isOpen: boolean;
  onClose: () => void;
  themeSetting: 'light' | 'dark' | 'auto';
  isOpenOnStartup: boolean;
  language: string;
  version: string;
}

const Preferences = ({
  isOpen,
  onClose,
  themeSetting,
  isOpenOnStartup,
  language,
  version,
}: PreferencesProps) => {
  const { t } = useTranslation('genericComponents');

  return (
    <Modal
      isOpen={isOpen}
      title={t('Preferences')}
      onClickCloseButton={onClose}
    >
      <span>Appearance</span>
      <span>{themeSetting}</span>
      <span>Launch on startup</span>
      <span>{isOpenOnStartup}</span>
      <span>Language</span>
      <span>{language}</span>
      <span>version</span>
      <span>{version}</span>
    </Modal>
  );
};

export default Preferences;
