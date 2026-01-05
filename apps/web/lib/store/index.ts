import { configureStore } from "@reduxjs/toolkit";
import excelReducer from './slice/excelSlice';
import promptReducer from './slice/promptSlice';

export const store = configureStore({
    reducer: {
        excel: excelReducer,
        prompt: promptReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;