import { useEffect, useState } from 'react';
import type { Settings } from '../../../main/state/settings.js';
import { useGetSettingsQuery } from '../../state/settingsService.js';

export const DevMode = ({ children }) => {
  const [sIsVisible, setIsVisible] = useState(false);
  const qSettings = useGetSettingsQuery();

  useEffect(() => {
    qSettings.refetch();
    const settingsData = qSettings?.data as Settings;
    // console.log('DEV MODE: settingsData', settingsData);
    setIsVisible(settingsData?.appIsDeveloperModeEnabled === true);
  }, [qSettings.data]);

  if (sIsVisible) {
    return (
      <div style={{ border: 1, borderStyle: 'dashed' }}>
        <span>👷</span>
        {children}
      </div>
    );
  }
  return null;
};
