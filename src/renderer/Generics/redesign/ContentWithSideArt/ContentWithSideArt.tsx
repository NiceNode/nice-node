import type React from 'react';
import { useTheme } from '../../../ThemeManager.js';
import onboarding1Dm from '../../../assets/images/artwork/onboarding-01-Dm.png';
import onboarding1Lm from '../../../assets/images/artwork/onboarding-01-Lm.png';
import {
  container,
  contentContainer,
  graphicsContainer,
} from './contentWithSideArt.css';

type Props = {
  children: React.ReactNode;
  graphic?: string;
  modal: boolean;
};

const ContentWithSideArt = ({ children, graphic, modal }: Props) => {
  const modalStyle = modal ? 'modal' : '';
  const { isDarkTheme } = useTheme();
  const defaultImage = isDarkTheme ? onboarding1Dm : onboarding1Lm;
  return (
    <div className={container}>
      <div className={[contentContainer, modalStyle].join(' ')}>{children}</div>

      {/* art graphic - background image matches content height more easily */}
      {!modal && (
        <div
          className={graphicsContainer}
          style={{ backgroundImage: `url(${graphic ?? defaultImage})` }}
        />
      )}
    </div>
  );
};
export default ContentWithSideArt;
