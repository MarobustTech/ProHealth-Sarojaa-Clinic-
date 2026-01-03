const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export interface Doctor {
  id: number
  _id?: string
  name: string
  specialization: string
  qualification?: string
  experience?: number
  consultationFee?: number
  consultation_fee?: number  // Support both formats
  languages?: string[]
  language?: string[]  // Alias
  about?: string
  bio?: string
  image?: string
  profilePicture?: string  // Alias
  isActive: boolean
  is_active?: boolean  // Support both formats
  opdTimings?: string
  opd_start_time?: string
  opd_end_time?: string
  slot_duration?: number
  createdAt?: string
}

export interface Specialization {
  id: number
  _id?: string
  name: string
  description?: string
  icon?: string
  isActive: boolean
  is_active?: boolean  // Support both formats
  createdAt?: string
}

export interface Appointment {
  id?: number
  patient_name: string
  phone: string
  email?: string
  service: string
  doctor: string
  appointment_datetime: string
  booking_source?: string
}

// Fetch active specializations for the booking website
export async function getActiveSpecializations(): Promise<Specialization[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/specializations?active_only=true`, {
      cache: "no-store",
    })
    if (!response.ok) {
      console.error(`Failed to fetch specializations: ${response.status} ${response.statusText}`)
      throw new Error("Failed to fetch specializations")
    }
    const data = await response.json()
    // Backend already filters by active_only, but double-check with isActive field
    return Array.isArray(data) ? data.filter((spec: Specialization) => spec.isActive !== false) : []
  } catch (error) {
    console.error("Error fetching specializations:", error)
    return []
  }
}

// Fetch active doctors by specialization
export async function getActiveDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/doctors?specialization=${encodeURIComponent(specialization)}&active_only=true`,
      {
        cache: "no-store",
      },
    )
    if (!response.ok) {
      console.error(`Failed to fetch doctors: ${response.status} ${response.statusText}`)
      throw new Error("Failed to fetch doctors")
    }
    const data = await response.json()
    // Backend already filters by active_only, but double-check with isActive field
    return Array.isArray(data) ? data.filter((doctor: Doctor) => doctor.isActive !== false) : []
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return []
  }
}

// Create appointment booking
export async function createAppointment(appointment: Appointment): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/api/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...appointment,
      booking_source: "website",
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Failed to create appointment")
  }

  return response.json()
}
