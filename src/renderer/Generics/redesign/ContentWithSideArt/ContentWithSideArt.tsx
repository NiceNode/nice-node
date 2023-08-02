import React from 'react';
import {
  contentContainer,
  container,
  graphicsContainer,
} from './contentWithSideArt.css';
import defaultGraphic from '../../../assets/images/artwork/NN-Onboarding-Artwork-01.png';

type Props = {
  children: React.ReactNode;
  graphic?: string;
  modal: boolean;
};

const ContentWithSideArt = ({ children, graphic, modal }: Props) => {
  const modalStyle = modal ? 'modal' : '';
  return (
    <div className={container}>
      <div className={[contentContainer, modalStyle].join(' ')}>{children}</div>

      {/* art graphic - background image matches content height more easily */}
      {!modal && (
        <div
          className={graphicsContainer}
          style={{ backgroundImage: `url(${graphic ?? defaultGraphic})` }}
        />
      )}
    </div>
  );
};
export default ContentWithSideArt;
