import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from './reducers/userSlice';



/**
 * Inisialisasi Redux store untuk mengelola state aplikasi.
 * 
 * @constant {Object} store Objek Redux store.
 */
const store = configureStore({
  reducer: {
    user: userReducer
  }
});



export { store };

