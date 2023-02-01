import {
  contentContainer,
  container,
  graphicsContainer,
} from './contentWithSideArt.css';
import defaultGraphic from '../../../assets/images/artwork/NN-Onboarding-Artwork-01.png';

type Props = {
  children: React.ReactNode;
  graphic?: string;
};

const ContentWithSideArt = ({ children, graphic }: Props) => {
  return (
    <div className={container}>
      <div className={contentContainer}>{children}</div>

      {/* art graphic - background image matches content height more easily */}
      <div
        className={graphicsContainer}
        style={{ backgroundImage: `url(${graphic ?? defaultGraphic})` }}
      />
    </div>
  );
};
export default ContentWithSideArt;
