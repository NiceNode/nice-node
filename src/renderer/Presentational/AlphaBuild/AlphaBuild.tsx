import Linking from 'renderer/Generics/redesign/Link/Linking';
import {
  container,
  contentContainer,
  contentSection,
  contentMajorTitle,
  contentTitle,
  topBanner,
} from './alphaBuild.css';
import alphaBanner from '../../assets/images/artwork/alphaBanner.svg';

const AlphaBuild = () => {
  return (
    <div className={container}>
      <div className={topBanner}>
        <img alt="Alpha build" src={alphaBanner} />
      </div>
      <div className={contentContainer}>
        <div className={contentSection}>
          <span className={contentMajorTitle}>This is an early version</span>
          <p>
            There are a couple of things you should know before continuing with
            this alpha release of NiceNode
          </p>
        </div>
        <div className={contentSection}>
          <span className={contentTitle}>Expect hiccups</span>
          <p>
            This build is still a Work In Progress, and some features might not
            work as intended. Please let us know of any issues you might
            encounter.
          </p>
          <Linking url="#" text="Join us on Discord" underline={false} />
        </div>
        <div className={contentSection}>
          <span className={contentTitle}>Error reporting turned on</span>
          <p>
            Reporting errors is essential to improve NiceNode's performance and
            compatibility with different systems. The collected data is
            anonymous but includes basic system information and encountered
            errors. This is an alpha specific measure and will be opt-out by
            default in a public release.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlphaBuild;
