import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/types';
import { useUser } from '@clerk/clerk-expo';
import { useCallback, useEffect, useState } from 'react';

interface UseUserDataReturn {
  userData: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage user data
 * @returns {UseUserDataReturn} Object containing user data, loading state, error state and refetch function
 */
export default function useUserData(): UseUserDataReturn {
  const { user } = useUser();
  const { showToast } = useToast();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', user.id)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data) {
        throw new Error('User not found');
      }

      setUserData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch user data';
      setError(new Error(errorMessage));
      showToast('Failed to fetch user data', 'error');
      console.error('[useUserData] Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id, showToast]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { userData, loading, error, refetch: fetchUserData };
}
