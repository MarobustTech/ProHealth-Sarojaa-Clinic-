// TypeScript type definitions for Hospital Management System

export interface Doctor {
    id?: number
    _id?: string
    name: string
    email?: string
    phone?: string
    specialization: string
    specializationId?: string
    experience: number
    qualification: string
    consultationFee: number
    opdTimings: string
    language?: string[]
    languages?: string[]
    bio?: string
    image?: string
    profilePicture?: string
    isActive: boolean
    status?: "active" | "inactive"
    createdAt?: string
}

export interface Patient {
    id: number
    name: string
    email: string
    phone: string
    age?: number
    gender?: "Male" | "Female" | "Other"
    bloodGroup?: string
    address?: string
    emergencyContact?: string
    medicalHistory?: string
    allergies?: string
    createdAt?: string
}

export interface Appointment {
    id: number
    patientName: string
    patientEmail?: string
    patientPhone: string
    patientAge?: number
    patientGender?: "Male" | "Female" | "Other"
    doctorId?: number
    doctorName?: string
    specialization: string
    appointmentDate: string
    appointmentTime: string
    status: "pending" | "confirmed" | "completed" | "cancelled"
    notes?: string
    createdAt?: string
}

export interface Specialization {
    id: number
    _id?: string
    name: string
    description?: string
    icon?: string
    isActive: boolean
    status?: "active" | "inactive"
    doctorCount?: number
    createdAt?: string
}

export interface Banner {
    id: number
    _id?: string
    title: string
    description?: string
    image?: string
    imageUrl?: string
    link?: string
    buttonText?: string
    buttonLink?: string
    isActive: boolean
    status?: "active" | "inactive"
    order: number
    createdAt?: string
}

export interface AppointmentStats {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
}

export interface DashboardStats {
    totalDoctors: number
    activeDoctors: number
    totalSpecializations: number
    activeSpecializations: number
    totalAppointments: number
    pendingAppointments: number
    confirmedAppointments: number
    completedAppointments: number
    totalPatients: number
    recentAppointments: Appointment[]
}

export interface AdminUser {
    id: number
    name: string
    email: string
}

export interface AuthResponse {
    success: boolean
    token: string
    admin: AdminUser
    message?: string
}
