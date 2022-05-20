import { FaDocker } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

const InstallDocker = () => {
  return (
    <div style={{ paddingRight: 40 }}>
      <h1>
        Install Docker <FaDocker />
      </h1>
      <p style={{ fontSize: '1.2em' }}>
        {
          "Docker helps NiceNode provide many nodes for users to choose from. \
           Docker is supported by most node development teams and is free for users to install. \
           Installing Docker will give you access to all of the Ethereum nodes! Follow Docker's \
           install guide. Docker will quietly run in the background after installation."
        }
      </p>
      <a
        target="_blank"
        href="https://docs.docker.com/desktop/#download-and-install"
        rel="noreferrer"
        style={{ fontSize: '1.2em' }}
      >
        Docker Desktop install guide
        <FiExternalLink />
      </a>
    </div>
  );
};
export default InstallDocker;
