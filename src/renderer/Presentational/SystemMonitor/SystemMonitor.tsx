import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import electron from '../../electronGlobal';
import { SystemMonitor as SystemMonitorLabels } from '../../Generics/redesign/SystemMonitor/SystemMonitor';
import { headerContainer, titleStyle } from './systemMonitor.css';
import { Benchmark } from '../../../main/state/benchmark';

const SystemMonitor = () => {
  const { t } = useTranslation();
  const [sBenchmarks, setBenchmarks] = useState<Benchmark[]>();

  const getData = async () => {
    setBenchmarks(await electron.getBenchmarks());
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className={headerContainer}>
        <div className={titleStyle}>{t('SystemMonitor')}</div>
      </div>
      <SystemMonitorLabels />
      <h2>Benchmarks</h2>
      <p>{JSON.stringify(sBenchmarks)}</p>
      <hr />
      {sBenchmarks && sBenchmarks[0] && (
        <p>{`Date: ${new Date(sBenchmarks[0].timestamp)} of type ${
          sBenchmarks[0].type
        }`}</p>
      )}
    </>
  );
};
export default SystemMonitor;
