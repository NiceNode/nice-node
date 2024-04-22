import { useTranslation } from 'react-i18next';
import {
  buttonContainer,
  container,
  description,
  link,
  title,
} from './updateCallout.css';

import Button from '../Button/Button';
import ExternalLink from '../Link/ExternalLink';

export interface UpdateCalloutProps {
  onClick: () => void;
}

export const UpdateCallout = ({ onClick }: UpdateCalloutProps) => {
  const { t: g } = useTranslation('genericComponents');
  const onInstallClick = () => {
    onClick();
    console.log('install action!');
  };
  return (
    <div className={container}>
      <div className={title}>{g('UpdateClientDescription')}</div>
      <div className={description}>
        {g('UpdateClientDescription', {
          client: 'test',
        })}
      </div>
      <div className={link}>
        <ExternalLink
          text={g('ViewReleaseNotes')}
          url="https://docs.docker.com/desktop/#download-and-install"
        />
      </div>
      <div className={buttonContainer}>
        <Button
          type="primary"
          wide
          label={g('InstallUpdate')}
          size="small"
          onClick={onInstallClick}
        />
        <Button wide label={g('Skip')} size="small" onClick={onClick} />
      </div>
    </div>
  );
};
