import { useTranslation } from 'react-i18next';
import Linking from '../../Generics/redesign/Link/Linking';
import {
  container,
  contentContainer,
  contentMajorTitle,
  contentSection,
  contentTitle,
} from './updatePodman.css';

const UpdatePodman = () => {
  const { t } = useTranslation();
  return (
    <div className={container}>
      <div className={contentContainer}>
        <div className={contentSection}>
          <span className={contentMajorTitle}>Update Podman</span>
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

export default UpdatePodman;
