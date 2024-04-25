import { createSlice } from '@reduxjs/toolkit';



/**
 * Fungsi utilitas untuk mendapatkan state pengguna dari sessionStorage atau localStorage.
 * 
 * @returns {Object|null} Objek state pengguna dari storage atau null jika tidak ada.
 */
function userStateInStorage() {
  const session = JSON.parse(sessionStorage.getItem('user'));
  if (session) return session;

  const local = JSON.parse(localStorage.getItem('user'));
  if (local) return local;

  return null;
}

/**
 * Slice Redux untuk mengelola informasi pengguna.
 */
const userSlice = createSlice({
  name: 'user',
  initialState: userStateInStorage(),
  reducers: {
    /**
     * Action creator untuk mengatur informasi pengguna.
     * 
     * @param {Object} state State pengguna saat ini.
     * @param {Object} action Payload yang berisi informasi pengguna (id, username, role, storageLocation).
     * @returns {Object} Objek pengguna yang diperbarui.
     */
    setUser: (state, action) => {
      const id = action.payload.id;
      const username = action.payload.username;
      const role = action.payload.role;

      const serializedObjectToStore = JSON.stringify({ id, username, role });
      if (action.payload.storageLocation === 'local') localStorage.setItem('user', serializedObjectToStore);
      else sessionStorage.setItem('user', serializedObjectToStore);

      return { id, username, role };
    },
    /**
     * Action creator untuk menghapus informasi pengguna dari state dan storage.
     * 
     * @param {Object} state State pengguna saat ini.
     * @returns {null} Objek pengguna yang telah dihapus.
     */
    clearUser: (state) => {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');

      return null;
    }
  }
});

const userReducer = userSlice.reducer;



export const { setUser, clearUser } = userSlice.actions;
export { userReducer };

