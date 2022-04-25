import { useEffect, useState } from 'react';
import electron from '../electronGlobal';

const NiceNodeSettings = () => {
  const [sShouldCheckForUpdates, setShouldCheckForUpdates] =
    useState<boolean>();

  const getShouldCheckForUpdates = async () => {
    const shouldCheckForUpdates = await electron.getStoreValue(
      'settings.shouldCheckForUpdates'
    );
    setShouldCheckForUpdates(shouldCheckForUpdates);
  };

  const saveShouldCheckForUpdates = async (value: boolean) => {
    await electron.setStoreValue('settings.shouldCheckForUpdates', value);
    // todo: if fails, show user
    setShouldCheckForUpdates(value);
  };

  useEffect(() => {
    getShouldCheckForUpdates();
  }, []);

  return (
    <>
      <h2>NiceNode</h2>
      <h3>Updates</h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'start',
          marginBottom: 10,
        }}
      >
        <form>
          <label htmlFor="shouldCheckForUpdates">
            <input
              id="shouldCheckForUpdates"
              type="checkbox"
              name="shouldCheckForUpdates"
              checked={sShouldCheckForUpdates}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                saveShouldCheckForUpdates(e.target.checked)
              }
            />
            Check for updates
          </label>
          {/* <label htmlFor="shouldAutoInstallUpdates">
            <input
              id="shouldAutoInstallUpdates"
              type="checkbox"
              name="shouldAutoInstallUpdates"
              checked={sShouldCheckForUpdates}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                saveShouldCheckForUpdates(e.target.checked)
              }
            />
            Automatically install updates (restarts NiceNode)
          </label> */}
        </form>
      </div>
    </>
  );
};
export default NiceNodeSettings;
