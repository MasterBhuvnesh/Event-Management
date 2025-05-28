import { supabase } from '@/lib/supabase';
import { User } from '@/types/types';
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';

export default function useUserData() {
  const { user } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', user.id);

        console.log('Fetching user data for userId:', user.id); // Debug log
        console.log('Supabase response:', data, fetchError); // Debug log
        if (fetchError) throw fetchError;
        if (!data || data.length === 0) {
          setError('User not found');
          setUserData(null);
          return;
        }
        console.log('Fetched user data:', data); // Debug log

        setUserData(data[0] as User);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching user data:', err); // Debug log
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return { userData, loading, error };
}
