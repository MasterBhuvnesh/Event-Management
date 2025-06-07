import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/types';
import { useCallback, useEffect, useState } from 'react';

interface UseEventsDataReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage events data
 * @returns {UseEventsDataReturn} Object containing events data, loading state, error state and refetch function
 */
export const useEventsData = (): UseEventsDataReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setEvents(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch events';
      setError(new Error(errorMessage));
      showToast('Failed to fetch events', 'error');
      console.error('[useEventsData] Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
};
