import { supabase } from '@/lib/supabase';

import { EventRegistrationUpdate } from '@/types/register';
import { ToastType } from '@/types/types';

/**
 * Verifies and checks in an attendee using registration ID and code
 * @param registrationId - The registration record ID (UUID)
 * @param code - The verification code from QR
 * @param checkedInBy - Admin user ID performing check-in
 * @returns Promise<{ success: boolean, message: string }>
 */
export async function checkInToEvent(
  registrationId: string,
  code: string,
  checkedInBy: string
): Promise<{ success: boolean; message: string; icon: ToastType }> {
  try {
    // 1. Verify the registration exists and code matches
    const { data: registration, error: findError } = await supabase
      .from('events_registrations')
      .select('id, status, user_id')
      .eq('id', registrationId)
      .eq('code', code)
      .maybeSingle();

    if (findError) throw new Error('Database error');
    if (!registration) {
      return {
        success: false,
        message: 'Invalid registration or code',
        icon: 'error',
      };
    }

    if (registration.status) {
      return {
        success: false,
        message: 'Already In',
        icon: 'warning',
      };
    }

    // 2. Perform the check-in update
    const updateData: EventRegistrationUpdate = {
      status: true,
      checked_in_at: new Date().toISOString(),
      checked_in_by: checkedInBy,
    };

    const { error: updateError } = await supabase
      .from('events_registrations')
      .update(updateData)
      .eq('id', registrationId);

    if (updateError) throw updateError;

    return {
      success: true,
      message: 'Successfully checked ',
      icon: 'success',
    };
  } catch (error) {
    console.error('Check-in failed:', error); // Debug log
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Check-in error',
      icon: 'error',
    };
  }
}
