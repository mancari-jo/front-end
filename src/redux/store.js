import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from './reducers/userSlice';
import { appReducer } from './reducers/appSlice';



/**
 * Inisialisasi Redux store untuk mengelola state aplikasi.
 * 
 * @constant {Object} store Objek Redux store.
 */
const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer
  }
});



export { store };

