// test-utils.jsx
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
// Import your own reducer
import { RtkqExecutionWs } from '../../renderer/state/services';
import { RtkqNodeService } from '../../renderer/state/nodeService';
// import appStore from '../renderer/state/store';
import { RtkqNetwork } from '../../renderer/state/network';
import nodeReducer from '../../renderer/state/node';
// import { RtkqNetwork } from '../renderer/state/network';

function render(
  ui: React.ReactElement,
  {
    store = configureStore({
      reducer: {
        node: nodeReducer,
        [RtkqNodeService.reducerPath]: RtkqNodeService.reducer,
        [RtkqExecutionWs.reducerPath]: RtkqExecutionWs.reducer,
        [RtkqNetwork.reducerPath]: RtkqNetwork.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        })
          .concat(RtkqNodeService.middleware)
          .concat(RtkqExecutionWs.middleware)
          .concat(RtkqNetwork.middleware),
    }),
    // store: appStore,
    ...renderOptions
  } = {}
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function Wrapper({ children }: any) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
