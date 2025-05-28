import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../libs/store';
import { setEmail, setOTP, setUser, setAccessToken } from '../libs/authSlice';
import { fetchUserData, UserData } from '../libs/api';

export const useAuths = () => {
  const dispatch = useDispatch<AppDispatch>();
  const email = useSelector((state: RootState) => state.auth.email);
  const otp = useSelector((state: RootState) => state.auth.otp);
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const fetchUser = async () => {
    try {
      const userData = await fetchUserData();
      dispatch(setUser(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error (e.g., redirect to login page)
    }
  };

  return {
    email,
    setEmail: (email: string) => dispatch(setEmail(email)),
    otp,
    setOTP: (otp: string) => dispatch(setOTP(otp)),
    user,
    setUser: (user: UserData | null) => dispatch(setUser(user)),
    accessToken,
    setAccessToken: (token: string | null) => dispatch(setAccessToken(token)),
    fetchUser,
  };
};