import {
  contentContianer,
  contianer,
  graphicsContianer,
} from './contentWithSideArt.css';
import defaultGraphic from '../../../assets/images/artwork/NN-Onboarding-Artwork-01.png';

type Props = {
  children: React.ReactNode;
  graphic?: string;
};

const ContentWithSideArt = ({ children, graphic }: Props) => {
  return (
    <div className={contianer}>
      <div className={contentContianer}>{children}</div>

      {/* art graphic - background image matches content height more easily */}
      <div
        className={graphicsContianer}
        style={{ backgroundImage: `url(${graphic ?? defaultGraphic})` }}
      />
    </div>
  );
};
export default ContentWithSideArt;
