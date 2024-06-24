import { useTranslation } from 'react-i18next';
import Linking from '../../Generics/redesign/Link/Linking';
import alphaBanner from '../../assets/images/artwork/alphaBanner.svg';
import {
  container,
  contentContainer,
  contentMajorTitle,
  contentSection,
  contentTitle,
  topBanner,
} from './cartridgeUpdate.css';

const CartridgeUpdate = ({ message }: { message: string }) => {
  const { t } = useTranslation();
  return (
    <div className={container}>
      <div className={contentContainer}>
        <div className={contentSection}>
          <span className={contentMajorTitle}>
            {t('Detailed Changes in the Update')}
          </span>
          <p>{message}</p>
        </div>
        {/* <div className={contentSection}>
          <span className={contentTitle}>{t('ExpectHiccups')}</span>
          <p>{t('WorkInProgress')}</p>
          <Linking url="#" text={t('JoinDiscord')} underline={false} />
        </div>
        <div className={contentSection}>
          <span className={contentTitle}>{t('ErrorReportingOn')}</span>
          <p>{t('ReportingErrors')}</p>
        </div> */}
      </div>
    </div>
  );
};

export default AlphaBuild;
