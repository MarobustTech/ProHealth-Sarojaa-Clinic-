from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Doctor, Patient, Appointment, Specialization, Banner
from app.auth import get_current_admin
import io
import csv
from datetime import datetime

router = APIRouter()

@router.get("/excel")
async def export_excel(current_admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Export all data as CSV (Excel-compatible)"""
    try:
        output = io.StringIO()
        
        # Create CSV with all data
        output.write("=== HOSPITAL DATA EXPORT ===\n")
        output.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        # Export Doctors
        output.write("=== DOCTORS ===\n")
        doctors = db.query(Doctor).all()
        if doctors:
            writer = csv.writer(output)
            writer.writerow(["ID", "Name", "Specialization", "Email", "Phone", "Experience", "Active"])
            for doc in doctors:
                writer.writerow([
                    doc.id, doc.name, doc.specialization, doc.email or "", 
                    doc.phone or "", doc.experience or 0, doc.is_active
                ])
        output.write("\n")
        
        # Export Patients
        output.write("=== PATIENTS ===\n")
        patients = db.query(Patient).all()
        if patients:
            writer = csv.writer(output)
            writer.writerow(["ID", "Name", "Email", "Phone", "Age", "Gender"])
            for patient in patients:
                writer.writerow([
                    patient.id, patient.name, patient.email, patient.phone,
                    patient.age or "", patient.gender or ""
                ])
        output.write("\n")
        
        # Export Appointments
        output.write("=== APPOINTMENTS ===\n")
        appointments = db.query(Appointment).all()
        if appointments:
            writer = csv.writer(output)
            writer.writerow(["ID", "Patient", "Doctor", "Specialization", "Date", "Time", "Status"])
            for apt in appointments:
                doctor_name = ""
                if apt.doctor_id:
                    doctor = db.query(Doctor).filter(Doctor.id == apt.doctor_id).first()
                    if doctor:
                        doctor_name = doctor.name
                writer.writerow([
                    apt.id, apt.patient_name, doctor_name, apt.specialization,
                    apt.appointment_date, apt.appointment_time, apt.status
                ])
        
        # Prepare response
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=hospital_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/pdf")
async def export_pdf(current_admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Export data summary as text (PDF generation requires additional libraries)"""
    try:
        # For now, return a text summary
        # To implement actual PDF, you'd need to install: pip install reportlab
        
        output = io.StringIO()
        
        output.write("=" * 60 + "\n")
        output.write("HOSPITAL DATA SUMMARY\n")
        output.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        output.write("=" * 60 + "\n\n")
        
        # Statistics
        total_doctors = db.query(Doctor).count()
        active_doctors = db.query(Doctor).filter(Doctor.is_active == True).count()
        total_patients = db.query(Patient).count()
        total_appointments = db.query(Appointment).count()
        pending_appointments = db.query(Appointment).filter(Appointment.status == "pending").count()
        
        output.write("STATISTICS\n")
        output.write("-" * 60 + "\n")
        output.write(f"Total Doctors: {total_doctors} (Active: {active_doctors})\n")
        output.write(f"Total Patients: {total_patients}\n")
        output.write(f"Total Appointments: {total_appointments} (Pending: {pending_appointments})\n\n")
        
        # Recent Appointments
        output.write("RECENT APPOINTMENTS (Last 10)\n")
        output.write("-" * 60 + "\n")
        recent = db.query(Appointment).order_by(Appointment.created_at.desc()).limit(10).all()
        for apt in recent:
            output.write(f"{apt.appointment_date} {apt.appointment_time} - {apt.patient_name} - {apt.status}\n")
        
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/plain",
            headers={
                "Content-Disposition": f"attachment; filename=hospital_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
