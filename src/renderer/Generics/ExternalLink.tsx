import { FiExternalLink } from 'react-icons/fi';

type Props = {
  title: string;
  url: string;
};

const ExternalLink = (props: Props) => {
  const { title, url } = props;

  return (
    <a
      target="_blank"
      href={url}
      rel="noreferrer"
      style={{ fontSize: '1.2em' }}
    >
      {title}
      <FiExternalLink />
    </a>
  );
};
export default ExternalLink;
