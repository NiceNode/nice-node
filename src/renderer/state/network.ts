import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

type CustomerErrorType = {
  message: string;
};
type ProviderResponse = {
  isConnected: boolean;
};

// Define a service using a base URL and expected endpoints
// lots of issues in RTKQ github complaining about typescript breaking changes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RtkqNetwork: any = createApi({
  reducerPath: 'RtkqNetwork',
  baseQuery: fakeBaseQuery<CustomerErrorType>(),
  endpoints: (builder) => ({
    getNetworkConnected: builder.query<ProviderResponse, null>({
      queryFn: async () => {
        const data = {
          isConnected: false,
        };
        try {
          await fetch('https://google.com', { mode: 'no-cors' });
          data.isConnected = true;
          console.log('fetched google');
        } catch (e) {
          const error = { message: 'Unable to confirm internet connection.' };
          console.log(error.message);
          return { error };
        }
        return { data };
      },
    }),
  }),
});

export const { useGetNetworkConnectedQuery } = RtkqNetwork;
