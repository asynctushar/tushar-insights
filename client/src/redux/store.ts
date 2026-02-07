import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slices/blog.slice';
import authReducer from './slices/auth.slice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            blog: blogReducer,
            auth: authReducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];