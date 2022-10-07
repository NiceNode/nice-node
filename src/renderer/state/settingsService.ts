import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Settings } from '../../main/state/settings';
import electron from '../electronGlobal';

type CustomerErrorType = {
  message: string;
};

// Define a service using a base URL and expected endpoints
// lots of issues in RTKQ github complaining about typescript breaking changes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    getIsDockerInstalled: builder.query<boolean, null>({
      queryFn: async () => {
        let data;
        try {
          console.log('RtkqSettingsService isDockerInstalled() calling..');
          data = await electron.getIsDockerInstalled();
          console.log(
            'RtkqSettingsService isDockerInstalled() returned ',
            data
          );
        } catch (e) {
          const error = { message: 'Unable to getIsDockerInstalled' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    getIsDockerRunning: builder.query<boolean, null>({
      queryFn: async () => {
        let data;
        try {
          console.log('RtkqSettingsService getIsDockerRunning() calling..');
          data = await electron.getIsDockerRunning();
          console.log(
            'RtkqSettingsService getIsDockerRunning() returned ',
            data
          );
        } catch (e) {
          const error = { message: 'Unable to getIsDockerRunning' };
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
  useGetIsDockerInstalledQuery,
  useGetIsDockerRunningQuery,
} = RtkqSettingsService;
