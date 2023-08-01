/* eslint-disable import/no-cycle */
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Settings } from '../../main/state/settings';
import electron from '../electronGlobal';

type CustomerErrorType = {
  message: string;
};

// Define a service using a base URL and expected endpoints
// lots of issues in RTKQ github complaining about typescript breaking changes
// eslint-disable-next-line
export const RtkqSettingsService: any = createApi({
  reducerPath: 'RtkqSettingsService',
  baseQuery: fakeBaseQuery<CustomerErrorType>(),
  endpoints: (builder) => ({
    getSettings: builder.query<Settings, null>({
      queryFn: async () => {
        let data;
        try {
          console.log('RtkqSettingsService getSettings() calling..');
          data = await electron.getSettings();
          console.log('RtkqSettingsService getSettings() returned ', data);
        } catch (e) {
          const error = { message: 'Unable to getSettings' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    getIsPodmanInstalled: builder.query<boolean, null>({
      queryFn: async () => {
        let data;
        try {
          console.log('RtkqSettingsService isPodmanInstalled() calling..');
          data = await electron.getIsPodmanInstalled();
          console.log(
            'RtkqSettingsService isPodmanInstalled() returned ',
            data,
          );
        } catch (e) {
          const error = { message: 'Unable to getIsPodmanInstalled' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    getIsPodmanRunning: builder.query<boolean, null>({
      queryFn: async () => {
        let data;
        try {
          console.log('RtkqSettingsService getIsPodmanRunning() calling..');
          data = await electron.getIsPodmanRunning();
          console.log(
            'RtkqSettingsService getIsPodmanRunning() returned ',
            data,
          );
        } catch (e) {
          const error = { message: 'Unable to getIsPodmanRunning' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetIsPodmanInstalledQuery,
  useGetIsPodmanRunningQuery,
} = RtkqSettingsService;
