from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Doctor
from app.schemas import DoctorCreate, DoctorUpdate, DoctorResponse, DoctorListResponse
from app.auth import get_current_admin
from datetime import datetime

router = APIRouter()

def doctor_to_response(doctor: Doctor) -> dict:
    return {
        "id": doctor.id,
        "_id": str(doctor.id),  # Support both id and _id for frontend compatibility
        "name": doctor.name,
        "specialization": doctor.specialization,
        "email": doctor.email if doctor.email else None,  # Ensure None is returned, not empty string
        "phone": doctor.phone if doctor.phone else None,
        "experience": doctor.experience,
        "qualification": doctor.qualification,
        "consultationFee": doctor.consultation_fee,
        "opdTimings": doctor.opd_timings,
        "languages": doctor.languages if doctor.languages else [],
        "language": doctor.languages if doctor.languages else [],  # Alias for frontend compatibility
        "bio": doctor.bio,
        "image": doctor.image,
        "profilePicture": doctor.image,  # Alias for frontend compatibility
        "isActive": doctor.is_active,
        "createdAt": doctor.created_at.isoformat() if doctor.created_at else None
    }

@router.get("", response_model=List[DoctorResponse])
@router.get("/all", response_model=List[DoctorResponse])
async def get_doctors(
    status: Optional[str] = Query(None, description="Filter by status: active"),
    active_only: Optional[bool] = Query(None, description="Filter active only"),
    specialization: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Doctor)
        
        if status == "active" or active_only:
            query = query.filter(Doctor.is_active == True)
        
        if specialization:
            query = query.filter(Doctor.specialization == specialization)
        
        doctors = query.all()

        # RESTRICT BOOKINGS TO PRIMARY DOCTORS (Kannan & Vijayapriya)
        # If filtering by specialization (Booking flow), ensure only on-call doctors are returned.
        if specialization:
            primary_keywords = ["kannan", "vijayapriya"]
            primary_matches = []
            for d in doctors:
                d_name_lower = d.name.lower()
                if any(k in d_name_lower for k in primary_keywords):
                    primary_matches.append(d)
            
            if primary_matches:
                doctors = primary_matches
            else:
                # If no primary doctor matches explicitly, default to Dr. Vijayapriya
                # This catches cases like visiting specialists (Endodontist, Implantologist etc.)
                default_doc = db.query(Doctor).filter(
                    Doctor.name.ilike("%Vijayapriya%"),
                    Doctor.is_active == True
                ).first()
                if default_doc:
                    doctors = [default_doc]
                else:
                    doctors = []

        result = [doctor_to_response(doc) for doc in doctors]
        return result
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in get_doctors: {e}")
        print(error_details)
        raise HTTPException(status_code=500, detail=f"Error fetching doctors: {str(e)}")

@router.get("/{doctor_id}", response_model=DoctorResponse)
async def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor_to_response(doctor)

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_doctor(
    doctor_data: DoctorCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Check if email already exists (only if email is provided)
    if doctor_data.email:
        existing_doctor = db.query(Doctor).filter(Doctor.email == doctor_data.email).first()
        if existing_doctor:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Doctor with this email already exists"
            )
    
    # Handle both 'languages' and 'language' fields, and 'image' and 'profilePicture'
    languages = doctor_data.languages or doctor_data.language
    image = doctor_data.image or doctor_data.profilePicture
    
    new_doctor = Doctor(
        name=doctor_data.name,
        specialization=doctor_data.specialization,
        email=doctor_data.email,
        phone=doctor_data.phone,
        experience=doctor_data.experience,
        qualification=doctor_data.qualification,
        consultation_fee=doctor_data.consultationFee,
        opd_timings=doctor_data.opdTimings,
        languages=languages,
        bio=doctor_data.bio,
        image=image,
        is_active=doctor_data.isActive if doctor_data.isActive is not None else True
    )
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    
    return {
        "success": True,
        "message": "Doctor created successfully",
        "doctor": doctor_to_response(new_doctor)
    }

@router.put("/{doctor_id}", response_model=dict)
async def update_doctor(
    doctor_id: int,
    doctor_data: DoctorUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Check email uniqueness if email is being updated
    if doctor_data.email and doctor_data.email != doctor.email:
        existing_doctor = db.query(Doctor).filter(Doctor.email == doctor_data.email).first()
        if existing_doctor:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Doctor with this email already exists"
            )
    
    # Update fields
    update_data = doctor_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "consultationFee":
            setattr(doctor, "consultation_fee", value)
        elif key == "opdTimings":
            setattr(doctor, "opd_timings", value)
        elif key == "isActive":
            setattr(doctor, "is_active", value)
        elif key == "language":
            # Handle 'language' field - map to 'languages'
            setattr(doctor, "languages", value)
        elif key == "profilePicture":
            # Handle 'profilePicture' field - map to 'image'
            setattr(doctor, "image", value)
        elif key not in ["language", "profilePicture"]:  # Skip aliases, already handled
            setattr(doctor, key, value)
    
    # Handle languages and image if provided via aliases
    if doctor_data.language is not None:
        doctor.languages = doctor_data.language
    elif doctor_data.languages is not None:
        doctor.languages = doctor_data.languages
    
    if doctor_data.profilePicture is not None:
        doctor.image = doctor_data.profilePicture
    elif doctor_data.image is not None:
        doctor.image = doctor_data.image
    
    db.commit()
    db.refresh(doctor)
    
    return {
        "success": True,
        "message": "Doctor updated successfully",
        "doctor": doctor_to_response(doctor)
    }

@router.patch("/{doctor_id}/toggle-active", response_model=dict)
async def toggle_doctor_active(
    doctor_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doctor.is_active = not doctor.is_active
    db.commit()
    db.refresh(doctor)
    
    return {
        "success": True,
        "message": f"Doctor {'activated' if doctor.is_active else 'deactivated'} successfully",
        "doctor": doctor_to_response(doctor)
    }

@router.delete("/{doctor_id}", response_model=dict)
async def delete_doctor(
    doctor_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    db.delete(doctor)
    db.commit()
    
    return {
        "success": True,
        "message": "Doctor deleted successfully"
    }

