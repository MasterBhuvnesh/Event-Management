import { supabase } from '@/lib/supabase';
import { Event } from '@/types/types';
import { useEffect, useState } from 'react';

export const useEventsData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*');

      if (fetchError) throw fetchError;

      setEvents(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, refetch: fetchEvents };
};
