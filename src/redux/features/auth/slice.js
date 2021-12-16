import { createSlice } from '@reduxjs/toolkit';
// extra reducers
import loginExtraReducers from './extraReducers/login';
// initial state
import INITIAL_STATE from './initialState';
// reducers
import logoutReducer from './reducers/logout';

export const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    logout: logoutReducer,
  },
  extraReducers: {
    ...loginExtraReducers,
  },
});

export default authSlice.reducer;
export const { logout: logoutAction } = authSlice.actions;
