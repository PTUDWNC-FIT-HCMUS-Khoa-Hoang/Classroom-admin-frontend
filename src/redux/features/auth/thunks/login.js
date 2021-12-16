import { createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../../../api/auth';

const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkApi) => {
    try {
      const response = await authApi.login(email, password);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);

export default login;
