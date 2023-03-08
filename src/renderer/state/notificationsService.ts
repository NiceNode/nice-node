/* eslint-disable import/no-cycle */
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Settings } from '../../main/state/settings';
import electron from '../electronGlobal';

type CustomerErrorType = {
  message: string;
};

// Define a service using a base URL and expected endpoints
// lots of issues in RTKQ github complaining about typescript breaking changes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RtkqNotificationsService: any = createApi({
  reducerPath: 'RtkqNotificationsService',
  baseQuery: fakeBaseQuery<CustomerErrorType>(),
  endpoints: (builder) => ({
    getNotifications: builder.query<Settings, null>({
      queryFn: async () => {
        let data;
        try {
          console.log('RtkqNotificationsService getNotifications() calling..');
          data = await electron.getNotifications();
          console.log(
            'RtkqNotificationsService getNotifications() returned ',
            data
          );
        } catch (e) {
          const error = { message: 'Unable to getNotifications' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
  }),
});

export const { useGetNotificationsQuery } = RtkqNotificationsService;
