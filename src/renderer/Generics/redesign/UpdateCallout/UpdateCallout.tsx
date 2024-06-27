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
import InternalLink from '../Link/InternalLink.js';

export interface UpdateCalloutProps {
  onClick: () => void;
  serviceName: string;
  releaseNotesUrl?: string;
  onClickShowChanges?: () => void;
}

export const UpdateCallout = ({
  onClick,
  serviceName,
  releaseNotesUrl,
  onClickShowChanges,
}: UpdateCalloutProps) => {
  const { t: g } = useTranslation('genericComponents');

  const onInstallClick = () => {
    onClick();
    console.log('install action!');
  };
  console.log('UpdateCallout releaseNotesUrl', releaseNotesUrl);
  return (
    <div className={container}>
      <div className={title}>
        {g('UpdateNamedClient', { client: serviceName })}
      </div>
      <div className={description}>
        {g('UpdateStopClient', {
          client: serviceName,
        })}
      </div>
      {releaseNotesUrl && (
        <div className={link}>
          <ExternalLink
            text={g('ViewNamedReleaseNotes', {
              name: serviceName,
            })}
            url={releaseNotesUrl}
          />
        </div>
      )}
      {onClickShowChanges && (
        <div className={link}>
          <InternalLink
            text={g('ViewDetailedChanges')}
            onClick={onClickShowChanges}
          />
        </div>
      )}
      <div className={buttonContainer}>
        <Button
          type="primary"
          wide
          label={g('InstallUpdate')}
          size="small"
          onClick={onInstallClick}
        />
        {/* <Button wide label={g('Skip')} size="small" onClick={onClick} /> */}
      </div>
    </div>
  );
};
