from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)  # Hashed password
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Specialization(Base):
    __tablename__ = "specializations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    icon = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    doctors = relationship("Doctor", back_populates="specialization_rel")

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)  # Can be name or reference
    email = Column(String(100), unique=True, index=True, nullable=True)  # Made optional
    phone = Column(String(20))
    experience = Column(Integer)
    qualification = Column(String(200), nullable=False)  # Made required
    consultation_fee = Column(Float)
    opd_timings = Column(String(100))  # e.g., "9:00 AM - 5:00 PM"
    languages = Column(JSON)  # Array of languages
    bio = Column(Text)
    image = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    specialization_id = Column(Integer, ForeignKey("specializations.id"), nullable=True)
    specialization_rel = relationship("Specialization", back_populates="doctors")
    appointments = relationship("Appointment", back_populates="doctor")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(String(50), index=True, nullable=True)  # For bot bookings
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)  # Link to Patient
    patient_name = Column(String(100), nullable=False)
    patient_email = Column(String(100), index=True)
    patient_phone = Column(String(20), nullable=False)
    patient_age = Column(Integer)
    patient_gender = Column(String(20))
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    specialization = Column(String(100), nullable=False)
    appointment_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    appointment_time = Column(String(20), nullable=False)  # HH:MM
    status = Column(String(20), default="pending")  # pending, confirmed, completed, cancelled
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    doctor = relationship("Doctor", back_populates="appointments")
    patient = relationship("Patient", backref="appointments")

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(String(50), unique=True, index=True, nullable=True)  # For bot users
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)  # Made nullable for bot users
    phone = Column(String(20), unique=True, index=True, nullable=False)
    age = Column(Integer)
    gender = Column(String(20))
    blood_group = Column(String(10))
    address = Column(Text)
    emergency_contact = Column(String(100))
    medical_history = Column(Text)
    allergies = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Banner(Base):
    __tablename__ = "banners"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=True, default="")
    description = Column(Text)
    image = Column(String(500))
    link = Column(String(500))
    button_text = Column(String(100))  # Store button text separately
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

