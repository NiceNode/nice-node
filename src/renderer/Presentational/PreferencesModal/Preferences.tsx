import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '../../Generics/redesign/Modal/Modal';
import LineLabelSettings from '../../Generics/redesign/LabelSettings/LabelSettings'
import { Toggle } from '../../Generics/redesign/Toggle/Toggle';
import Select from '../../Generics/redesign/Select/Select';

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
      <LineLabelSettings items={[{sectionTitle: 'Preferences',
      items: [
        {
          label: 'Theme color', value: <Select options={[{ value: 'auth', label: "Auth (Follows computer setting)" }, { value: 'auth', label: "Auth (Follows computer setting)" }, { value: 'light', label: "Light mode" }, { value: 'dark', label: "Dark mode" }]} />
        },
          { label: 'Launch on startup', value: <Toggle checked={isOpenOnStartup} /> },
          {
            label: 'Language', value: <Select options={[{ value: 'en', label: "English" }]}/>
          }
        ]
      }]}/>
      <span>version</span>
      <span>{version}</span>
    </Modal>
  );
};

export default Preferences;
