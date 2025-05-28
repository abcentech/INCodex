import { RootState } from "./store";

export const getAccessToken = (state: RootState): string | null => {
  return state.auth.accessToken;
};
