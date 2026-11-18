export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
  price_max: number | null
  is_active: boolean
  created_at: string
}

export interface Appointment {
  id: string
  service_id: string
  full_name: string
  email: string
  phone: string
  notes: string | null
  address: string | null
  booking_email_sent_at: string | null
  appointment_date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  created_at: string
}

export interface AppointmentWithService extends Appointment {
  services: Pick<Service, 'id' | 'name' | 'duration_minutes' | 'price'> | null
}

export interface BusinessHours {
  id: string
  weekday: number
  is_open: boolean
  start_time: string | null
  end_time: string | null
}

export interface BlockedDate {
  id: string
  blocked_date: string
  reason: string | null
  created_at: string
}

export interface BusinessSettings {
  id: string
  business_name: string
  business_email: string
  business_phone: string
  business_address: string
  slot_interval_minutes: number
  booking_notice_hours: number
  travel_buffer_minutes: number
  created_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  created_at: string
}

// end_time and status are no longer client inputs — the server computes end_time
// from the service's duration and always inserts as 'pending' (see book_appointment()).
export interface NewAppointmentInput {
  service_id: string
  full_name: string
  email: string
  phone: string
  notes: string | null
  address: string
  appointment_date: string
  start_time: string
}
