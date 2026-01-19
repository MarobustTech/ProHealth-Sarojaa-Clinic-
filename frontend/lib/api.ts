import { getAdminToken } from "./admin-auth"
export type { Doctor, Specialization, Appointment } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

// Centralized API call function with automatic token injection and error handling
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Add any custom headers from options
  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }))
    throw new Error(error.detail || `Request failed with status ${response.status}`)
  }

  return response.json()
}

// ============================================================================
// PUBLIC BOOKING API (for website visitors)
// ============================================================================

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

// Create appointment booking (public - no auth required)
export async function createAppointment(appointment: any): Promise<{ token: string }> {
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

// ============================================================================
// ADMIN API (requires authentication)
// ============================================================================

export const api = {
  // Dashboard stats
  getStats: () => apiCall("/api/admin/stats"),

  // Doctors
  getDoctors: (params?: { status?: string; specialization?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    return apiCall(`/api/doctors${query ? `?${query}` : ""}`)
  },
  getDoctor: (id: string | number) => apiCall(`/api/doctors/${id}`),
  createDoctor: (data: any) => apiCall("/api/doctors", { method: "POST", body: JSON.stringify(data) }),
  updateDoctor: (id: string | number, data: any) =>
    apiCall(`/api/doctors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggleDoctorActive: (id: string | number) => apiCall(`/api/doctors/${id}/toggle-active`, { method: "PATCH" }),
  deleteDoctor: (id: string | number) => apiCall(`/api/doctors/${id}`, { method: "DELETE" }),

  // Specializations
  getSpecializations: (params?: { status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    return apiCall(`/api/specializations${query ? `?${query}` : ""}`)
  },
  getSpecialization: (id: string | number) => apiCall(`/api/specializations/${id}`),
  createSpecialization: (data: any) =>
    apiCall("/api/specializations", { method: "POST", body: JSON.stringify(data) }),
  updateSpecialization: (id: string | number, data: any) =>
    apiCall(`/api/specializations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggleSpecializationActive: (id: string | number) =>
    apiCall(`/api/specializations/${id}/toggle-active`, { method: "PATCH" }),
  deleteSpecialization: (id: string | number) => apiCall(`/api/specializations/${id}`, { method: "DELETE" }),

  // Appointments
  getAppointments: (params?: { status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    return apiCall(`/api/appointments${query ? `?${query}` : ""}`)
  },
  getAppointment: (id: string | number) => apiCall(`/api/appointments/${id}`),
  updateAppointmentStatus: (id: string | number, status: string) =>
    apiCall(`/api/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // Patients
  getPatients: () => apiCall("/api/patients"),
  getPatient: (id: string | number) => apiCall(`/api/patients/${id}`),

  // Banners
  getBanners: (params?: { status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    return apiCall(`/api/banners${query ? `?${query}` : ""}`)
  },
  getBanner: (id: string | number) => apiCall(`/api/banners/${id}`),
  createBanner: (data: any) => apiCall("/api/banners", { method: "POST", body: JSON.stringify(data) }),
  updateBanner: (id: string | number, data: any) =>
    apiCall(`/api/banners/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggleBannerActive: (id: string | number) => apiCall(`/api/banners/${id}/toggle-active`, { method: "PATCH" }),
  deleteBanner: (id: string | number) => apiCall(`/api/banners/${id}`, { method: "DELETE" }),
}
