import { supabase } from '@/lib/supabase';
import { EventRegistrationInsert } from '@/types/register';

/**
 * Registers a user for an event
 * @param eventId - The ID of the event to register for
 * @param userId - The ID of the user registering
 * @returns Promise<{registrationId: string, code: string}>
 * @throws Error if registration fails
 */

export async function registerForEvent(
  eventId: string,
  userId: string
): Promise<{ registrationId: string; code: string; newRegistration: boolean }> {
  try {
    // 1. Verify the event exists and registration is open
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, registration_status')
      .eq('id', eventId)
      .single();

    if (eventError) {
      throw new Error('Event not found');
    }
    if (event.registration_status !== 'Open') {
      throw new Error('Event registration is closed');
    }

    // 2. Check if user is already registered
    const { data: existingRegistration, error: existingError } = await supabase
      .from('events_registrations')
      .select('id,code')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }
    if (existingRegistration) {
      return {
        registrationId: existingRegistration.id,
        code: existingRegistration.code, // Use generated code if none returned
        newRegistration: false, // Indicate this is not a new registration
      };
    }

    // 4. Create the registration record
    const registrationData: EventRegistrationInsert = {
      event_id: eventId,
      user_id: userId,
      status: false, // Default to "ongoing" status
    };

    const { data: registration, error: registrationError } = await supabase
      .from('events_registrations')
      .insert(registrationData)
      .select('id, code')
      .single();

    if (registrationError) {
      throw registrationError;
    }
    if (!registration) {
      throw new Error('Failed to create registration'); // debug log
    }

    return {
      registrationId: registration.id,
      code: registration.code, // Use generated code if none returned
      newRegistration: true, // Indicate this is a new registration
    };
  } catch (error) {
    console.error('Registration failed:', error);

    throw new Error(
      error instanceof Error ? error.message : 'Registration failed'
    ); // debug log
  }
}
