"use strict";
import { headers } from "next/headers";
import { store } from "./store";
import { getAccessToken } from "./authUtils";
import { setAccessToken, setVerified } from "./authSlice";
import { clearAuth } from "./authSlice";
import { setUser } from "./authSlice";

const baseURL = "https://investnaira.vercel.app/api/v1";

export interface UserData {
  email?: string;
  phone_number?: string;
  password1?: string;
  password2?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  user_type?: string;
  gender?: string;
  location?: string;
}

export interface SignUpResponse {
  success: boolean;
  message?: string;
}

export interface WalletResponse {
  id: string;
  balance: string;
  created_at: string;
  updated_at: string;
  user: string;
}

export const signup = async (userData: UserData): Promise<SignUpResponse> => {
  console.log("Sending signup request to server:", userData);

  try {
    const response = await fetch(`${baseURL}/auth/registration/register/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Raw server response:", data);

    if (!response.ok) {
      console.error("Server responded with an error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    console.log("Successful response from server:", data);
    return { success: true, ...data };
  } catch (error) {
    console.error("Error during signup:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during signup",
    };
  }
};

export const verifyAccount = async (
  email: string,
  otp: string
): Promise<SignUpResponse> => {
  console.log(`Verifying account for ${email} with code ${otp}`);

  try {
    const response = await fetch(`${baseURL}/auth/verify-otp/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    console.log("Raw server response:", data);

    if (!response.ok) {
      console.error("Server responded with an error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    store.dispatch(setVerified(true));
    const userData = await fetchUserData();
    store.dispatch(setUser(userData));

    console.log("Successful response from server:", data);
    return { success: true, ...data };
  } catch (error) {
    console.error("Error during account verification:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during account verification",
    };
  }
};

export const resendVerificationCode = async (
  email: string
): Promise<SignUpResponse> => {
  console.log(`Resending verification code to ${email}`);

  try {
    const response = await fetch(`${baseURL}/auth/registration/resend-email/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("Raw server response:", data);

    if (!response.ok) {
      console.error("Server responded with an error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    console.log("Successful response from server:", data);
    return { success: true, ...data };
  } catch (error) {
    console.error("Error during resend verification:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while resending the verification code",
    };
  }
};

export const login = async (email: string, password: string): Promise<any> => {
  console.log(`Logging in user: ${email}`);
  try {
    const response = await fetch(`${baseURL}/auth/login/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Raw server response:", data);

    if (!response.ok) {
      console.error("Server responded with an error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    console.log("Successful login response from server:", data);

    // Store the access token in Redux
    if (data.access) {
      store.dispatch(setAccessToken(data.access));
    } else {
      console.warn("Login successful, but no access token received");
    }

    return { success: true, ...data };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during login",
    };
  }
};

export const requestPasswordReset = async (
  email: string
): Promise<SignUpResponse> => {
  console.log(`Requesting password reset for ${email}`);

  try {
    const response = await fetch(`${baseURL}/auth/password/reset`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("Raw server response:", data);

    if (!response.ok) {
      console.error("Server responded with an error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    console.log("Successful response from server:", data);
    return { success: true, ...data };
  } catch (error) {
    console.error("Error during password reset request:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during password reset request",
    };
  }
};

export const confirmPasswordReset = async (
  email: string,
  otp: string,
  new_password: string
): Promise<SignUpResponse> => {
  console.log(`Confirming password reset for ${email}`);

  try {
    const response = await fetch(`${baseURL}/auth/password/reset/confirm/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, new_password }),
    });

    const data = await response.json();
    console.log("Raw server response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Server responded with an error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    console.log("Successful password reset confirmation from server:", data);
    return { success: true, ...data };
  } catch (error) {
    console.error("Error during password reset confirmation:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during password reset confirmation",
    };
  }
};

export const fetchWalletDetails = async (): Promise<WalletResponse> => {
  try {
    const response = await fetch(`${baseURL}/wallet`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Wallet details response:", data);

    if (!response.ok) {
      console.error("Server responded with an error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data as WalletResponse;
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while fetching wallet details"
    );
  }
};

export const fetchUserData = async (): Promise<UserData> => {
  try {
    const state = store.getState();
    const accessToken = getAccessToken(state);

    if (!accessToken) {
      throw new Error(
        "No access token available. User might not be logged in."
      );
    }

    const response = await fetch(`${baseURL}/auth/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log("User data response:", data);

    if (!response.ok) {
      console.error("Server responded with an error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(
        data.detail || data.message || `HTTP error! status: ${response.status}`
      );
    }

    return data as UserData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw the original error
  }
};

export const logout = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const state = store.getState();
    const accessToken = state.auth.accessToken;

    if (!accessToken) {
      console.warn(
        "No access token available. User might already be logged out."
      );
      store.dispatch(clearAuth());
      return { success: true, message: "Logged out successfully" };
    }

    const response = await fetch(`${baseURL}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Server responded with an error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    console.log("Successful logout response from server:", data);
    store.dispatch(clearAuth());

    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Error during logout:", error);
    store.dispatch(clearAuth());
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during logout",
    };
  }
};

export const updateUserData = async (
  userData: Partial<UserData>
): Promise<UserData> => {
  try {
    const state = store.getState();
    const accessToken = getAccessToken(state);

    if (!accessToken) {
      throw new Error(
        "No access token available. User might not be logged in."
      );
    }

    const response = await fetch(`${baseURL}/auth/user`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("User data update response:", data);

    if (!response.ok) {
      console.error("Server responded with an error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(
        data.detail || data.message || `HTTP error! status: ${response.status}`
      );
    }
    store.dispatch(setUser(data));

    return data as UserData;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};
