import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Settings } from '../main/state/settings';
import { useAppSelector } from './state/hooks';
import { selectSelectedNode } from './state/node';
import { useGetNodeVersionQuery } from './state/services';
import { useGetSettingsQuery } from './state/settingsService';

const DataRefresher = () => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const qNodeVersion = useGetNodeVersionQuery(
    selectedNode?.spec.rpcTranslation,
  );
  const { i18n } = useTranslation();
  const qSettings = useGetSettingsQuery();

  console.log('qNodeVersion', JSON.stringify(qNodeVersion));
  useEffect(() => {
    console.log(
      'DataRefresher: selected node or nodeVersion query changed. Refetching node version.',
    );
    qNodeVersion.refetch();
    // RTKQ does not work as a dependency. Will cause an infinite loop if included.
  }, [selectedNode]);

  // Sets the app language based on user or os setting
  useEffect(() => {
    let appLanguage = 'en';
    if (qSettings?.data) {
      const settings: Settings = qSettings.data;
      if (settings.appLanguage) {
        appLanguage = settings.appLanguage;
      } else if (settings.osLanguage) {
        // Only 2-letter language codes supported right now
        //   OS's can return 4+ letter language codes
        appLanguage = settings.osLanguage.substring(0, 2);
      }
    }
    // This will set the language when the app loads.
    if (appLanguage !== i18n.language) {
      i18n.changeLanguage(appLanguage);
    }
  }, [i18n, qSettings.data]);

  return <></>;
};
export default DataRefresher;
