import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from './state/hooks';
import { selectSelectedNode, selectSelectedNodeId } from './state/node';
import electron from './electronGlobal';
import { useGetNodeVersionQuery } from './state/services';
import { useGetSettingsQuery } from './state/settingsService';
import { Settings } from '../main/state/settings';

const DataRefresher = () => {
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  const selectedNode = useAppSelector(selectSelectedNode);
  const qNodeVersion = useGetNodeVersionQuery(
    selectedNode?.spec.rpcTranslation
  );
  const { i18n } = useTranslation();
  const qSettings = useGetSettingsQuery();

  useEffect(() => {
    const updateNodeDU = async () => {
      // todo: fix warnings for multi-client
      if (sSelectedNodeId) {
        await electron.updateNodeUsedDiskSpace(sSelectedNodeId);
      }
    };
    updateNodeDU();
    const intveral = setInterval(updateNodeDU, 120000);
    return () => clearInterval(intveral);
  }, [sSelectedNodeId]);

  useEffect(() => {
    console.log(
      'DataRefresher: selected node or nodeVersion query changed. Refetching node version.'
    );
    qNodeVersion.refetch();
    // RTKQ does not work as a dependency. Will cause an infinite loop if included.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
