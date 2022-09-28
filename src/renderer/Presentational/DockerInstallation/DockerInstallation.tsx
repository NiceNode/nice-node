import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  captionText,
  container,
  descriptionFont,
  titleFont,
} from './dockerInstallation.css';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import electron from '../../electronGlobal';
import { Button } from '../../Generics/redesign/Button/Button';
import ProgressBar from '../../Generics/redesign/ProgressBar/ProgressBar';

export interface DockerInstallationProps {
  /**
   * Listen to node config changes
   */
  onChange: (newValue: string) => void;
}

const DockerInstallation = ({ onChange }: DockerInstallationProps) => {
  const { t } = useTranslation();
  const [sIsOptionsOpen, setIsOptionsOpen] = useState<boolean>();

  // listen to docker install messages
  // total filesize, current downloaded amount, time left or front-end calcs
  return (
    <div className={container}>
      <div className={titleFont}>{t('DockerInstallation')}</div>
      <div className={descriptionFont}>
        <>{t('dockerPurpose')}</>
      </div>
      <ExternalLink
        text={t('LearnMoreDocker')}
        url="https://www.docker.com/products/docker-desktop/"
      />
      <div>
        <Button
          primary
          label={t('DownloadAndInstall')}
          onClick={() => console.log('downloading docker')}
        />
        <div className={captionText}>500MB download</div>
      </div>
      <ProgressBar
        progress={25}
        title="Downloading Docker..."
        caption="60MB of 500MB downloaded — About 55 seconds remaining"
      />
      <ProgressBar
        progress={25}
        title="Installing..."
        caption="About 55 seconds remaining"
      />
    </div>
  );
};

export default DockerInstallation;
