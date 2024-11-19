import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { usersApi } from "./services/users.api";
import {scoresApi} from "./services/scores.api";
import {authApi} from "./services/auth.api";


export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [scoresApi.reducerPath]: scoresApi.reducer,
   [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat([usersApi.middleware, scoresApi.middleware, authApi.middleware]), // Add scoresApi.middleware
});

setupListeners(store.dispatch);
