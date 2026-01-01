from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Admin, Doctor, Specialization, Appointment, Patient
from app.schemas import AdminRegister, AdminLogin, AdminAuthResponse, AdminResponse, DashboardStatsResponse, DashboardStats
from app.auth import get_password_hash, verify_password, create_access_token, get_current_admin

router = APIRouter()

@router.post("/register", response_model=AdminAuthResponse)
async def register(admin_data: AdminRegister, db: Session = Depends(get_db)):
    # Check if admin with email already exists
    existing_admin = db.query(Admin).filter(Admin.email == admin_data.email).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new admin
    hashed_password = get_password_hash(admin_data.password)
    new_admin = Admin(
        name=admin_data.name,
        email=admin_data.email,
        password=hashed_password
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    # Create access token (sub must be a string for JWT)
    access_token = create_access_token(data={"sub": str(new_admin.id)})
    
    return {
        "success": True,
        "message": "Admin registered successfully",
        "token": access_token,
        "admin": AdminResponse(id=new_admin.id, name=new_admin.name, email=new_admin.email)
    }

@router.post("/login", response_model=AdminAuthResponse)
async def login(admin_data: AdminLogin, db: Session = Depends(get_db)):
    # Find admin by email
    admin = db.query(Admin).filter(Admin.email == admin_data.email).first()
    if not admin or not verify_password(admin_data.password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token (sub must be a string for JWT)
    access_token = create_access_token(data={"sub": str(admin.id)})
    
    return {
        "success": True,
        "token": access_token,
        "admin": AdminResponse(id=admin.id, name=admin.name, email=admin.email)
    }

@router.get("/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    # Get statistics
    total_doctors = db.query(func.count(Doctor.id)).scalar() or 0
    active_doctors = db.query(func.count(Doctor.id)).filter(Doctor.is_active == True).scalar() or 0
    
    total_specializations = db.query(func.count(Specialization.id)).scalar() or 0
    active_specializations = db.query(func.count(Specialization.id)).filter(Specialization.is_active == True).scalar() or 0
    
    total_appointments = db.query(func.count(Appointment.id)).scalar() or 0
    pending_appointments = db.query(func.count(Appointment.id)).filter(Appointment.status == "pending").scalar() or 0
    confirmed_appointments = db.query(func.count(Appointment.id)).filter(Appointment.status == "confirmed").scalar() or 0
    completed_appointments = db.query(func.count(Appointment.id)).filter(Appointment.status == "completed").scalar() or 0
    
    total_patients = db.query(func.count(Patient.id)).scalar() or 0
    
    # Get recent appointments (last 10)
    recent_appointments_query = db.query(Appointment).order_by(Appointment.created_at.desc()).limit(10).all()
    recent_appointments = []
    for apt in recent_appointments_query:
        doctor_name = None
        if apt.doctor_id:
            doctor = db.query(Doctor).filter(Doctor.id == apt.doctor_id).first()
            if doctor:
                doctor_name = doctor.name
        
        recent_appointments.append({
            "id": apt.id,
            "patientName": apt.patient_name,
            "patientEmail": apt.patient_email,
            "doctorName": doctor_name,
            "specialization": apt.specialization,
            "appointmentDate": apt.appointment_date,
            "appointmentTime": apt.appointment_time,
            "status": apt.status,
            "createdAt": apt.created_at.isoformat() if apt.created_at else None
        })
    
    stats = DashboardStats(
        totalDoctors=total_doctors,
        activeDoctors=active_doctors,
        totalSpecializations=total_specializations,
        activeSpecializations=active_specializations,
        totalAppointments=total_appointments,
        pendingAppointments=pending_appointments,
        confirmedAppointments=confirmed_appointments,
        completedAppointments=completed_appointments,
        totalPatients=total_patients,
        recentAppointments=recent_appointments
    )
    
    return {
        "success": True,
        "stats": stats
    }

