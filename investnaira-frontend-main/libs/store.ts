import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import transactionReducer from './transactionSlice'

const persistConfig = {
  key: 'root',
  storage,
};

const persistAuthReducer = persistReducer(persistConfig, authReducer);
const persistTransactionReducer = persistReducer(persistConfig, transactionReducer);

export const store = configureStore({
  reducer: {
    auth: persistAuthReducer,
    transactions: persistTransactionReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;