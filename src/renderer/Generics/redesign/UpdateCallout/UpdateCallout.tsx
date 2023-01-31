import {
  container,
  title,
  description,
  link,
  buttonContainer,
} from './updateCallout.css';

import Button from '../Button/Button';
import ExternalLink from '../Link/ExternalLink';

export interface UpdateCalloutProps {
  onClick: () => void;
}

export const UpdateCallout = ({ onClick }: UpdateCalloutProps) => {
  const onInstallClick = () => {
    onClick();
    console.log('install action!');
  };
  return (
    <div className={container}>
      <div className={title}>Update your client</div>
      <div className={description}>
        Nimbus v22.8.1 has been downloaded and is ready to install.
      </div>
      <div className={link}>
        <ExternalLink
          text="View release notes"
          url="https://docs.docker.com/desktop/#download-and-install"
        />
      </div>
      <div className={buttonContainer}>
        <Button
          type="primary"
          wide
          label="Install Update"
          size="small"
          onClick={onInstallClick}
        />
        <Button wide label="Skip" size="small" onClick={onClick} />
      </div>
    </div>
  );
};
