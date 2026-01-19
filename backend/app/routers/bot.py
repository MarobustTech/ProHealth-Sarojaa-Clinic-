from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Doctor, Appointment, Patient
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/bot", tags=["Telegram Bot"])

# ===== GET ALL DOCTORS =====

@router.get("/doctors")
async def get_all_doctors(db: Session = Depends(get_db)):
    """Get all active doctors - for 'Our Doctors' menu"""
    try:
        doctors = db.query(Doctor).filter(Doctor.is_active == True).all()
        
        return [
            {
                "id": str(doctor.id),
                "name": doctor.name,
                "specialization": doctor.specialization,
                "hospital": "Sree Sarojaa Multi Specialty Dental Clinic",
                "qualification": doctor.qualification,
                "experience": f"{doctor.experience} years" if doctor.experience else "Experienced",
                "languages": doctor.languages if doctor.languages else ["English", "Tamil"],
                "fee": doctor.consultation_fee or 500,
                "about": doctor.bio or "Experienced dental specialist"
            }
            for doctor in doctors
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== CLINIC INFORMATION =====

@router.get("/clinic-info")
async def get_clinic_info():
    """Get clinic information - for 'Hospital Information' menu"""
    return {
        "name": "Sree Sarojaa Multi Specialty Dental Clinic",
        "address": "Near Vincent Bus Stop, Cherry Road\nKumaraswamypatti, Salem - 636007",
        "phone": "0427 2313339",
        "mobile": "8946088182",
        "hours": {
            "weekdays": "Monday - Friday: 8:00 AM - 8:00 PM",
            "saturday": "Saturday: 9:00 AM - 5:00 PM",
            "sunday": "Sunday: Closed"
        },
        "about": "We provide comprehensive, patient-friendly dental care with modern equipment and experienced specialists. Your smile is our priority!",
        "maps_link": "https://maps.google.com/?q=Sree+Sarojaa+Multi+Specialty+Dental+Clinic+Salem"
    }


# ===== DOCTORS BY SPECIALIZATION =====

@router.get("/doctors/by-specialization")
async def get_doctors_by_specialization(
    specialization: str,
    db: Session = Depends(get_db)
):
    """Get active doctors by specialization - for booking flow
    Restricted to Dr. K.P. Senthamarai Kannan and Dr. S. Vijayapriya as they are the only on-call doctors.
    """
    try:
        # keywords to identify primary doctors
        primary_keywords = ["kannan", "vijayapriya"]
        
        # 1. Helper to format doctor data
        def format_doc(d):
            return {
                "id": str(d.id),
                "name": d.name,
                "specialization": d.specialization,
                "hospital": "Sree Sarojaa Multi Specialty Dental Clinic",
                "qualification": d.qualification,
                "experience": f"{d.experience} years" if d.experience else "Experienced",
                "languages": d.languages if d.languages else ["English", "Tamil"],
                "fee": d.consultation_fee or 500,
                "about": d.bio or "Experienced dental specialist"
            }

        # 2. Find all doctors matching the specialization
        # 2. Find all doctors matching the specialization
        # First try exact match
        matches = db.query(Doctor).filter(
            Doctor.specialization == specialization,
            Doctor.is_active == True
        ).all()
        
        if not matches:
            # Try partial match
            matches = db.query(Doctor).filter(
                Doctor.specialization.ilike(f"%{specialization}%"),
                Doctor.is_active == True
            ).all()

        if matches:
            return [format_doc(d) for d in matches]
            
        # 3. Fallback: If no doctor matches this specialization, return General Dentists
        general_docs = db.query(Doctor).filter(
            Doctor.specialization == "General Dentistry",
            Doctor.is_active == True
        ).all()
        
        if general_docs:
            return [format_doc(d) for d in general_docs]
            
        return []

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== AVAILABILITY / TIME SLOTS =====

@router.get("/availability")
async def get_availability(
    doctor_id: str,
    date: str,
    db: Session = Depends(get_db)
):
    """Get available time slots for a doctor on a specific date"""
    try:
        from datetime import datetime
        
        # Parse the date to check day of week
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        day_of_week = date_obj.weekday()  # 0=Monday, 6=Sunday
        
        # Debug logging
        day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        print(f"[AVAILABILITY] Date: {date}, Day: {day_names[day_of_week]} (weekday={day_of_week})")
        
        # Define time slots based on day
        if day_of_week == 6:  # Sunday
            # Clinic closed on Sunday
            print(f"[AVAILABILITY] Sunday - clinic closed, returning empty slots")
            return []
        elif day_of_week == 5:  # Saturday
            # Saturday: 9 AM - 5 PM (last appointment at 5 PM)
            time_slots = [
                "09:00", "10:00", "11:00", "12:00",
                "14:00", "15:00", "16:00", "17:00"
            ]
        else:  # Monday-Friday
            # Weekdays: 8 AM - 8 PM
            time_slots = [
                "08:00", "09:00", "10:00", "11:00", "12:00",
                "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
            ]
        
        # Get existing appointments for this doctor on this date
        appointments = db.query(Appointment).filter(
            Appointment.doctor_id == int(doctor_id),
            Appointment.appointment_date == date,
            Appointment.status != "cancelled"
        ).all()
        
        # Get booked times
        booked_times = [apt.appointment_time for apt in appointments]
        
        # Return availability
        return [
            {
                "time": slot,
                "available": slot not in booked_times
            }
            for slot in time_slots
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== CREATE BOT APPOINTMENT =====

@router.post("/appointments")
async def create_bot_appointment(data: dict, db: Session = Depends(get_db)):
    """Create appointment from Telegram bot with patient management"""
    try:
        # 1. Extract data
        patient_data = data.get("patient_data", {})
        telegram_id = patient_data.get("telegram_id")
        
        if not telegram_id:
            raise HTTPException(status_code=400, detail="telegram_id is required")
        
        # 2. Create or update Patient
        patient = db.query(Patient).filter(Patient.telegram_id == telegram_id).first()
        
        if not patient:
            # Create new patient
            patient = Patient(
                telegram_id=telegram_id,
                name=patient_data.get("name", "Telegram User"),
                phone=patient_data.get("phone", "N/A"),
                email=patient_data.get("email")
            )
            db.add(patient)
            db.commit()
            db.refresh(patient)
        else:
            # Update existing patient info if provided
            if patient_data.get("name"):
                patient.name = patient_data["name"]
            if patient_data.get("phone"):
                patient.phone = patient_data["phone"]
            db.commit()
        
        # 3. Get doctor details
        doctor_id = int(data["doctor_id"])
        doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        # 4. Create appointment
        appointment = Appointment(
            telegram_id=telegram_id,
            patient_id=patient.id,
            patient_name=patient.name,
            patient_phone=patient.phone,
            patient_email=patient.email,
            doctor_id=doctor.id,
            specialization=doctor.specialization,
            appointment_date=data["date"],
            appointment_time=data["time"],
            status="confirmed"  # Bot appointments are auto-confirmed
        )
        db.add(appointment)
        db.commit()
        db.refresh(appointment)
        
        # 5. Return bot-compatible format
        return {
            "token": f"APT{appointment.id:06d}",
            "date": appointment.appointment_date,
            "time": appointment.appointment_time,
            "doctor": doctor.name,
            "doctor_id": doctor.id,
            "specialization": doctor.specialization,
            "patient_name": patient.name
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ===== GET USER APPOINTMENTS =====

@router.get("/appointments/{telegram_id}")
async def get_user_appointments(telegram_id: str, db: Session = Depends(get_db)):
    """Get all appointments for a Telegram user"""
    try:
        appointments = db.query(Appointment).filter(
            Appointment.telegram_id == telegram_id,
            Appointment.status != "cancelled"
        ).order_by(Appointment.appointment_date.desc()).all()
        
        result = []
        for apt in appointments:
            doctor = db.query(Doctor).filter(Doctor.id == apt.doctor_id).first()
            result.append({
                "token": f"APT{apt.id:06d}",
                "date": apt.appointment_date,
                "time": apt.appointment_time,
                "doctor": doctor.name if doctor else "Unknown",
                "doctor_id": apt.doctor_id,
                "specialization": apt.specialization,
                "status": apt.status
            })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== AI SPECIALIZATION DETECTION =====

@router.post("/ai/specialization")
async def detect_specialization(data: dict):
    """Simple keyword-based specialization detection"""
    text = data.get("text", "").lower()
    
    # Return specialization names matching database
    if any(word in text for word in ["root", "canal", "filling", "nerve", "endodontic"]):
        return {"specialization": "Endodontics"}
    elif any(word in text for word in ["brace", "align", "straighten", "crooked", "orthodontic"]):
        return {"specialization": "Orthodontics"}
    elif any(word in text for word in ["child", "kid", "pediatric", "baby", "pedodontic"]):
        return {"specialization": "Pediatric Dentistry"}
    elif any(word in text for word in ["crown", "bridge", "denture", "implant", "prosthodontic"]):
        return {"specialization": "Prosthodontics"}
    elif any(word in text for word in ["gum", "bleeding", "periodontal"]):
        return {"specialization": "Periodontics"}
    elif any(word in text for word in ["implant", "screw", "fixing"]):
        return {"specialization": "Implantology"}
    elif any(word in text for word in ["surgery", "extraction", "wisdom", "oral surgeon"]):
        return {"specialization": "Oral & Maxillofacial Surgery"}
    else:
        return {"specialization": "General Dentistry"}
