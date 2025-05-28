import { useState } from 'react';
import { signup, UserData, SignUpResponse } from '../libs/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (userData: UserData): Promise<SignUpResponse | undefined> => {
    console.log('Initiating signup with userData:', userData);
    setLoading(true);
    setError(null);

    try {
      const response = await signup(userData);
      console.log('Received signup response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Signup was unsuccessful');
      }

      return response;
    } catch (err) {
      console.error('Error in handleSignUp:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during signup';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, loading, error };
}