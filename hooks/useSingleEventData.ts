import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/types';
import { useEffect, useState } from 'react';

export const useSingleEventData = (event_id: string) => {
  const { showToast } = useToast();
  const [event, setEvent] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .eq('id', event_id);

        if (fetchError) throw fetchError;

        setEvent(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error fetching events');
        showToast(err.message || 'Error fetching events', 'error');
        console.error('Error fetching events:', err); // Debug log
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [showToast]);

  return { event, loading, error };
};
