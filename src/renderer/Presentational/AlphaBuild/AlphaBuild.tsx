import { useTranslation } from 'react-i18next';
import Linking from '../../Generics/redesign/Link/Linking';
import {
  container,
  contentContainer,
  contentSection,
  contentMajorTitle,
  contentTitle,
  topBanner,
} from './alphaBuild.css';
import { ReactComponent as alphaBanner } from '../../assets/images/artwork/alphaBanner.svg';

const AlphaBuild = () => {
  const { t } = useTranslation();
  return (
    <div className={container}>
      <div className={topBanner}>
        <img alt="Alpha build" src={alphaBanner} />
      </div>
      <div className={contentContainer}>
        <div className={contentSection}>
          <span className={contentMajorTitle}>{t('EarlyVersion')}</span>
          <p>{t('YouShouldKnow')}</p>
        </div>
        <div className={contentSection}>
          <span className={contentTitle}>{t('ExpectHiccups')}</span>
          <p>{t('WorkInProgress')}</p>
          <Linking url="#" text={t('JoinDiscord')} underline={false} />
        </div>
        <div className={contentSection}>
          <span className={contentTitle}>{t('ErrorReportingOn')}</span>
          <p>{t('ReportingErrors')}</p>
        </div>
      </div>
    </div>
  );
};

export default AlphaBuild;
