from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Appointment, Doctor, Patient
from app.schemas import AppointmentCreate, AppointmentStatusUpdate, AppointmentResponse
from app.auth import get_current_admin
from datetime import datetime

router = APIRouter()

def appointment_to_response(apt: Appointment, db: Session) -> dict:
    doctor_name = None
    if apt.doctor_id:
        doctor = db.query(Doctor).filter(Doctor.id == apt.doctor_id).first()
        if doctor:
            doctor_name = doctor.name
    
    return {
        "id": apt.id,
        "patientName": apt.patient_name,
        "patientEmail": apt.patient_email,
        "patientPhone": apt.patient_phone,
        "patientAge": apt.patient_age,
        "patientGender": apt.patient_gender,
        "doctorId": apt.doctor_id,
        "doctorName": doctor_name,
        "specialization": apt.specialization,
        "appointmentDate": apt.appointment_date,
        "appointmentTime": apt.appointment_time,
        "status": apt.status,
        "notes": apt.notes,
        "createdAt": apt.created_at
    }

@router.get("", response_model=List[AppointmentResponse])
async def get_appointments(
    status: Optional[str] = Query(None, description="Filter by status: pending, confirmed, completed, cancelled"),
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Appointment)
    
    if status:
        query = query.filter(Appointment.status == status)
    
    appointments = query.order_by(Appointment.created_at.desc()).all()
    return [appointment_to_response(apt, db) for apt in appointments]

@router.get("/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment_to_response(appointment, db)

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db)
):
    # Handle field name variations from frontend
    patient_name = appointment_data.patientName or appointment_data.patient_name
    patient_email = appointment_data.patientEmail or appointment_data.email
    patient_phone = appointment_data.patientPhone or appointment_data.phone
    specialization = appointment_data.specialization or appointment_data.service
    
    # Parse appointment_datetime if provided
    appointment_date = appointment_data.appointmentDate
    appointment_time = appointment_data.appointmentTime
    
    if appointment_data.appointment_datetime:
        # Parse ISO datetime string (e.g., "2024-01-15T10:00:00.000Z")
        from datetime import datetime
        try:
            dt = datetime.fromisoformat(appointment_data.appointment_datetime.replace('Z', '+00:00'))
            appointment_date = dt.strftime("%Y-%m-%d")
            appointment_time = dt.strftime("%H:%M")
        except:
            # Fallback: try to extract from string
            parts = appointment_data.appointment_datetime.split('T')
            if len(parts) == 2:
                appointment_date = parts[0]
                time_part = parts[1].split('.')[0]
                appointment_time = time_part[:5]  # HH:MM
    
    # Handle doctor lookup by name if doctorId not provided
    doctor_id = appointment_data.doctorId
    if not doctor_id and appointment_data.doctor:
        # Try to find doctor by name
        doctor = db.query(Doctor).filter(Doctor.name == appointment_data.doctor).first()
        if doctor:
            doctor_id = doctor.id
    
    # Validate required fields
    if not patient_name:
        raise HTTPException(status_code=400, detail="Patient name is required")
    if not patient_phone:
        raise HTTPException(status_code=400, detail="Patient phone is required")
    if not specialization:
        raise HTTPException(status_code=400, detail="Specialization/service is required")
    if not appointment_date:
        raise HTTPException(status_code=400, detail="Appointment date is required")
    if not appointment_time:
        raise HTTPException(status_code=400, detail="Appointment time is required")
    
    # Create or update patient record
    patient = None
    if patient_email:
        patient = db.query(Patient).filter(Patient.email == patient_email).first()
        if not patient:
            # Try to find by phone
            patient = db.query(Patient).filter(Patient.phone == patient_phone).first()
    
    if not patient and patient_email:
        # Create new patient
        patient = Patient(
            name=patient_name,
            email=patient_email,
            phone=patient_phone,
            age=appointment_data.patientAge,
            gender=appointment_data.patientGender
        )
        db.add(patient)
        db.flush()
    
    # Create appointment
    new_appointment = Appointment(
        patient_name=patient_name,
        patient_email=patient_email,
        patient_phone=patient_phone,
        patient_age=appointment_data.patientAge,
        patient_gender=appointment_data.patientGender,
        doctor_id=doctor_id,
        specialization=specialization,
        appointment_date=appointment_date,
        appointment_time=appointment_time,
        status="pending",
        notes=appointment_data.notes
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    return {
        "success": True,
        "message": "Appointment created successfully",
        "appointment": appointment_to_response(new_appointment, db),
        "token": f"appt_{new_appointment.id}"  # Return a token for frontend compatibility
    }

@router.patch("/{appointment_id}/status", response_model=dict)
async def update_appointment_status(
    appointment_id: int,
    status_data: AppointmentStatusUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    valid_statuses = ["pending", "confirmed", "completed", "cancelled"]
    if status_data.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    appointment.status = status_data.status
    db.commit()
    db.refresh(appointment)
    
    return {
        "success": True,
        "message": "Appointment status updated successfully",
        "appointment": appointment_to_response(appointment, db)
    }

