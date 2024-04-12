import { configureStore } from '@reduxjs/toolkit';
import { render as rtlRender } from '@testing-library/react';
// test-utils.jsx
import type React from 'react';
import { Provider } from 'react-redux';
import modalReducer from '../../renderer/state/modal';
// import appStore from '../renderer/state/store';
import { RtkqNetwork } from '../../renderer/state/network';
import nodeReducer from '../../renderer/state/node';
import { RtkqNodeService } from '../../renderer/state/nodeService';
import { RtkqNotificationsService } from '../../renderer/state/notificationsService';
// Import your own reducer
import { RtkqExecutionWs } from '../../renderer/state/services';
import { RtkqSettingsService } from '../../renderer/state/settingsService';
// import { RtkqNetwork } from '../renderer/state/network';

function render(
  ui: React.ReactElement,
  {
    store = configureStore({
      reducer: {
        node: nodeReducer,
        modal: modalReducer,
        [RtkqNodeService.reducerPath]: RtkqNodeService.reducer,
        [RtkqSettingsService.reducerPath]: RtkqSettingsService.reducer,
        [RtkqExecutionWs.reducerPath]: RtkqExecutionWs.reducer,
        [RtkqNetwork.reducerPath]: RtkqNetwork.reducer,
        [RtkqNotificationsService.reducerPath]:
          RtkqNotificationsService.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        })
          .concat(RtkqNodeService.middleware)
          .concat(RtkqSettingsService.middleware)
          .concat(RtkqExecutionWs.middleware)
          .concat(RtkqNetwork.middleware)
          .concat(RtkqNotificationsService.middleware),
    }),
    // store = configureStore({
    //   reducer: {
    //     node: nodeReducer,
    //     [RtkqNodeService.reducerPath]: RtkqNodeService.reducer,
    //     [RtkqExecutionWs.reducerPath]: RtkqExecutionWs.reducer,
    //     [RtkqNetwork.reducerPath]: RtkqNetwork.reducer,
    //   },
    //   middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //       serializableCheck: false,
    //     })
    //       .concat(RtkqNodeService.middleware)
    //       .concat(RtkqExecutionWs.middleware)
    //       .concat(RtkqNetwork.middleware),
    // }),
    // store: appStore,
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }: any) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
