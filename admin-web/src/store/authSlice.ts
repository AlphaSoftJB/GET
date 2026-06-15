import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../types';

const initialState: AuthState = {
  isAuthenticated: true,
  user: { name: 'Admin User', email: 'admin@get-app.com', role: 'Admin', avatar: '👨‍💼' },
  token: 'mock-token-12345',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthState['user']>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = 'mock-token-' + Date.now();
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    updateProfile(state, action: PayloadAction<Partial<NonNullable<AuthState['user']>>>) {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
