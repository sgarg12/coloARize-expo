import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import {configureStore} from '@reduxjs/toolkit';

import {reducer} from './reducer';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, reducer);
export const store = configureStore({reducer: persistedReducer});
export const persistor = persistStore(store);
