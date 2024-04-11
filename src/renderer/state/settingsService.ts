import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PodmanDetails } from '../../main/podman/details';
import type { Settings } from '../../main/state/settings';
import electron from '../electronGlobal';

type CustomerErrorType = {
  message: string;
};

// Define a service using a base URL and expected endpoints
// lots of issues in RTKQ github complaining about typescript breaking changes
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
          data = await electron.getIsPodmanInstalled();
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
          data = await electron.getIsPodmanRunning();
        } catch (e) {
          const error = { message: 'Unable to getIsPodmanRunning' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    getPodmanDetails: builder.query<PodmanDetails, null>({
      queryFn: async () => {
        let data;
        try {
          data = await electron.getPodmanDetails();
        } catch (e) {
          const error = { message: 'Unable to getPodmanDetails' };
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
  useGetPodmanDetailsQuery,
} = RtkqSettingsService;
