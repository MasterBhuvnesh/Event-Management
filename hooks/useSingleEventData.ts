import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/types';
import { useCallback, useEffect, useState } from 'react';

interface UseSingleEventDataReturn {
  event: Event | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage single event data
 * @param eventId - The ID of the event to fetch
 * @returns {UseSingleEventDataReturn} Object containing event data, loading state, error state and refetch function
 */
export const useSingleEventData = (
  eventId: string
): UseSingleEventDataReturn => {
  const { showToast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!eventId) {
      setError(new Error('Event ID is required'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data) {
        throw new Error('Event not found');
      }

      setEvent(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch event';
      setError(new Error(errorMessage));
      showToast('Failed to fetch event details', 'error');
      console.error('[useSingleEventData] Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [eventId, showToast]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { event, loading, error, refetch: fetchEvent };
};
