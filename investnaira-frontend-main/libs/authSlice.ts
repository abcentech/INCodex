import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from './api';

interface AuthState {
  email: string;
  otp: string;
  user: UserData | null;
  accessToken: string | null; 
  isVerified: boolean;
}

const initialState: AuthState = {
  email: '',
  otp: '',
  user: {},
  accessToken: null, 
  isVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setOTP: (state, action: PayloadAction<string>) => {
      state.otp = action.payload;
    },
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {  
      state.accessToken = action.payload;
    },
    setVerified: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
    clearAuth: (state) => {
      return initialState;
    },
  },
});

export const { setEmail, setOTP, setUser, setAccessToken, setVerified, clearAuth } = authSlice.actions;
export default authSlice.reducer;