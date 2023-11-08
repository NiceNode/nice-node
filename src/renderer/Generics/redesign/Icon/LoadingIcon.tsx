import { Icon } from './Icon';
import { loadingIcon } from './loadingIcon.css';

export const LoadingIcon = () => {
  return (
    <span className={loadingIcon}>
      <Icon iconId="spinnerendless" />
    </span>
  );
};
