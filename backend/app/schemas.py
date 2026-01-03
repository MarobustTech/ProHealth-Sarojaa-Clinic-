from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Admin Schemas
class AdminRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: int
    name: str
    email: str
    
    class Config:
        from_attributes = True

class AdminAuthResponse(BaseModel):
    success: bool
    token: str
    admin: AdminResponse
    message: Optional[str] = None

# Doctor Schemas
class DoctorCreate(BaseModel):
    name: str
    specialization: str
    qualification: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    experience: Optional[int] = None
    consultationFee: Optional[float] = None
    opdTimings: Optional[str] = None
    languages: Optional[List[str]] = None
    language: Optional[List[str]] = None  # Alias for frontend compatibility
    bio: Optional[str] = None
    image: Optional[str] = None
    profilePicture: Optional[str] = None  # Alias for frontend compatibility
    isActive: Optional[bool] = True

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    experience: Optional[int] = None
    qualification: Optional[str] = None
    consultationFee: Optional[float] = None
    opdTimings: Optional[str] = None
    languages: Optional[List[str]] = None
    language: Optional[List[str]] = None  # Alias for frontend compatibility
    bio: Optional[str] = None
    image: Optional[str] = None
    profilePicture: Optional[str] = None  # Alias for frontend compatibility
    isActive: Optional[bool] = None

class DoctorResponse(BaseModel):
    id: int
    name: str
    specialization: str
    email: Optional[str] = None  # Explicitly allow None
    phone: Optional[str] = None
    experience: Optional[int] = None
    qualification: Optional[str] = None
    consultationFee: Optional[float] = None
    opdTimings: Optional[str] = None
    languages: Optional[List[str]] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    isActive: bool
    createdAt: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class DoctorListResponse(BaseModel):
    success: bool
    doctors: List[DoctorResponse]

# Specialization Schemas
class SpecializationCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    isActive: Optional[bool] = True

class SpecializationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    isActive: Optional[bool] = None

class SpecializationResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    icon: Optional[str]
    isActive: bool
    createdAt: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentCreate(BaseModel):
    patientName: Optional[str] = None
    patient_name: Optional[str] = None  # Frontend compatibility
    patientEmail: Optional[EmailStr] = None
    email: Optional[EmailStr] = None  # Frontend compatibility
    patientPhone: Optional[str] = None
    phone: Optional[str] = None  # Frontend compatibility
    patientAge: Optional[int] = None
    patientGender: Optional[str] = None
    doctorId: Optional[int] = None
    doctor: Optional[str] = None  # Frontend compatibility - doctor name
    specialization: Optional[str] = None
    service: Optional[str] = None  # Frontend compatibility - maps to specialization
    appointmentDate: Optional[str] = None
    appointmentTime: Optional[str] = None
    appointment_datetime: Optional[str] = None  # Frontend compatibility - ISO datetime string
    notes: Optional[str] = None
    booking_source: Optional[str] = None  # Frontend compatibility - ignored

class AppointmentStatusUpdate(BaseModel):
    status: str  # pending, confirmed, completed, cancelled

class AppointmentResponse(BaseModel):
    id: int
    patientName: str
    patientEmail: Optional[str]
    patientPhone: str
    patientAge: Optional[int]
    patientGender: Optional[str]
    doctorId: Optional[int]
    doctorName: Optional[str] = None
    specialization: str
    appointmentDate: str
    appointmentTime: str
    status: str
    notes: Optional[str]
    createdAt: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Patient Schemas
class PatientResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    age: Optional[int]
    gender: Optional[str]
    bloodGroup: Optional[str]
    address: Optional[str]
    emergencyContact: Optional[str]
    medicalHistory: Optional[str]
    allergies: Optional[str]
    appointments: Optional[List[dict]] = []
    createdAt: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Banner Schemas
class BannerCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    buttonText: Optional[str] = None  # Frontend compatibility
    buttonLink: Optional[str] = None  # Frontend compatibility
    isActive: Optional[bool] = True
    order: Optional[int] = 0

class BannerUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    buttonText: Optional[str] = None  # Frontend compatibility
    buttonLink: Optional[str] = None  # Frontend compatibility
    isActive: Optional[bool] = None
    order: Optional[int] = None

class BannerResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    image: Optional[str]
    link: Optional[str]
    isActive: bool
    order: int
    createdAt: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Dashboard Stats Schema
class DashboardStats(BaseModel):
    totalDoctors: int
    activeDoctors: int
    totalSpecializations: int
    activeSpecializations: int
    totalAppointments: int
    pendingAppointments: int
    confirmedAppointments: int
    completedAppointments: int
    totalPatients: int
    recentAppointments: List[dict]

class DashboardStatsResponse(BaseModel):
    success: bool
    stats: DashboardStats

