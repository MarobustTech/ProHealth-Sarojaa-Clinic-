from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Patient, Appointment, Doctor
from app.schemas import PatientResponse
from app.auth import get_current_admin

router = APIRouter()

def patient_to_response(patient: Patient, db: Session) -> dict:
    # Get patient appointments
    appointments_query = db.query(Appointment).filter(
        (Appointment.patient_email == patient.email) | 
        (Appointment.patient_phone == patient.phone)
    ).all()
    
    appointments = []
    for apt in appointments_query:
        doctor_name = None
        if apt.doctor_id:
            doctor = db.query(Doctor).filter(Doctor.id == apt.doctor_id).first()
            if doctor:
                doctor_name = doctor.name
        
        appointments.append({
            "id": apt.id,
            "doctorName": doctor_name,
            "specialization": apt.specialization,
            "date": apt.appointment_date,
            "time": apt.appointment_time,
            "status": apt.status
        })
    
    return {
        "id": patient.id,
        "name": patient.name,
        "email": patient.email or "",  # Return empty string if None
        "phone": patient.phone or "",  # Return empty string if None
        "age": patient.age,
        "gender": patient.gender,
        "bloodGroup": patient.blood_group,
        "address": patient.address,
        "emergencyContact": patient.emergency_contact,
        "medicalHistory": patient.medical_history,
        "allergies": patient.allergies,
        "appointments": appointments,
        "createdAt": patient.created_at
    }

@router.get("", response_model=List[PatientResponse])
async def get_patients(
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    patients = db.query(Patient).all()
    return [patient_to_response(patient, db) for patient in patients]

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_to_response(patient, db)

