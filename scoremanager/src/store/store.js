import { configureStore  } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { scoresApi } from "./services/scores.api";


export const store = configureStore({
    reducer: {
        [scoresApi.reducerPath]:scoresApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
          .concat([scoresApi.middleware])

}

);

setupListeners(store.dispatch);