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
        {/* TODO: 100% width */}
        <Button
          primary
          wide
          label="Install Update"
          size="small"
          onClick={onClick}
        />
      </div>
    </div>
  );
};
