import { createSlice } from '@reduxjs/toolkit';



const appSlice = createSlice({
  name: 'user',
  initialState: {
    searchJobQuery: ''
  },
  reducers: {
    setSearchJobQuery: (state, action) => {
      state.searchJobQuery = action.payload;
    }
  }
});

const appReducer = appSlice.reducer;



export const { setSearchJobQuery } = appSlice.actions;
export { appReducer };

