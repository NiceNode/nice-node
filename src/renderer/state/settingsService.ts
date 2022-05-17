import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { NodeSpecification } from '../../common/nodeSpec';
import Node from '../../common/node';
import electron from '../electronGlobal';

type CustomerErrorType = {
  message: string;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProviderResponse = any;

// Define a service using a base URL and expected endpoints
// lots of issues in RTKQ github complaining about typescript breaking changes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RtkqSettingsService: any = createApi({
  reducerPath: 'RtkqSettingsService',
  baseQuery: fakeBaseQuery<CustomerErrorType>(),
  endpoints: (builder) => ({
    getIsDockerInstalled: builder.query<boolean, Node[]>({
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
  }),
});

export const { useGetIsDockerInstalledQuery } = RtkqSettingsService;
