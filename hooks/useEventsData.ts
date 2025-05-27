import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/types';
import { useEffect, useState } from 'react';

export const useEventsData = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('events')
          .select('*');

        if (fetchError) throw fetchError;

        setEvents(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error fetching events');
        showToast(err.message || 'Error fetching events', 'error');
        console.error('Error fetching events:', err); // Debug log
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [showToast]);

  return { events, loading, error };
};
