import { useTranslation } from 'react-i18next';

import { SystemMonitor as SystemMonitorLabels } from '../../Generics/redesign/SystemMonitor/SystemMonitor';
import { headerContainer, titleStyle } from './systemMonitor.css';
import { Benchmarks } from './Benchmarks';

const SystemMonitor = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className={headerContainer}>
        <div className={titleStyle}>{t('SystemMonitor')}</div>
      </div>
      <Benchmarks />
      <SystemMonitorLabels />
    </>
  );
};
export default SystemMonitor;
