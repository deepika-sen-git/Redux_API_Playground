import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import profilesReducer from './slices/profilesSlice';
import profileDetailReducer from './slices/profileDetailSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        profiles: profilesReducer,
        profileDetail: profileDetailReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
