export type EventRegistration = {
  id: string; // UUID
  event_id: string; // References events.id
  user_id: string; // References users.id
  code?: string; // QR code
  registration_time: string; // ISO timestamp
  status: boolean; // false = Ongoing, true = Confirmed
  checked_in_at: string | null; // ISO timestamp
  checked_in_by: string | null; // References users.id (admin who confirmed)
};

export type EventRegistrationInsert = Omit<
  EventRegistration,
  'id' | 'registration_time' | 'checked_in_at' | 'checked_in_by'
>;

export type EventRegistrationUpdate = Partial<
  Omit<EventRegistration, 'id' | 'event_id' | 'user_id' | 'registration_time'>
>;
