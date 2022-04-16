import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { RtkqExecutionWs } from './services';
import { RtkqNetwork } from './network';
import nodeReducer from './node';

export const store = configureStore({
  reducer: {
    node: nodeReducer,
    [RtkqExecutionWs.reducerPath]: RtkqExecutionWs.reducer,
    [RtkqNetwork.reducerPath]: RtkqNetwork.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(RtkqExecutionWs.middleware)
      .concat(RtkqNetwork.middleware),
});
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
