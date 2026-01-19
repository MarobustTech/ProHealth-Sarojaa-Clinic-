from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid

app = FastAPI(title="Hospital Appointment Backend")

# ---------------- MOCK DATABASE ----------------

doctors = [
    # ---------- GENERAL PHYSICIAN ----------
    {
        "id": "1",
        "name": "Dr. Sangeeta Verma",
        "specialization": "General", 
        
        "hospital": "City Care Hospital",
        "qualification": "MBBS, DNB",
        "experience": "20 years",
        "languages": ["English", "Hindi"],
        "fee": 300,
        "about": "Senior general physician treating all age groups."
    },
    {
        "id": "2",
        "name": "Dr. Anil Kumar",
        "specialization": "General",
        "hospital": "Apollo Clinic",
        "qualification": "MBBS, MD",
        "experience": "12 years",
        "languages": ["English", "Hindi", "Telugu"],
        "fee": 400,
        "about": "Expert in internal medicine and lifestyle disorders."
    },

    # ---------- CARDIOLOGY ----------
    {
        "id": "3",
        "name": "Dr. Rajesh Mehta",
        "specialization": "Cardiology",
        "hospital": "Heart Care Center",
        "qualification": "MBBS, MD, DM (Cardiology)",
        "experience": "18 years",
        "languages": ["English", "Hindi"],
        "fee": 700,
        "about": "Specialist in heart diseases and cardiac diagnostics."
    },
    {
        "id": "4",
        "name": "Dr. Kavita Iyer",
        "specialization": "Cardiology",
        "hospital": "MedLife Hospital",
        "qualification": "MBBS, MD, DM",
        "experience": "10 years",
        "languages": ["English", "Tamil"],
        "fee": 650,
        "about": "Focused on preventive cardiology and patient education."
    },

    # ---------- DERMATOLOGY ----------
    {
        "id": "5",
        "name": "Dr. Neha Sharma",
        "specialization": "Dermatology",
        "hospital": "SkinCare Clinic",
        "qualification": "MBBS, MD (Dermatology)",
        "experience": "9 years",
        "languages": ["English", "Hindi"],
        "fee": 500,
        "about": "Treats skin, hair and nail conditions."
    },
    {
        "id": "6",
        "name": "Dr. Pooja Nair",
        "specialization": "Dermatology",
        "hospital": "Glow Skin Center",
        "qualification": "MBBS, MD",
        "experience": "7 years",
        "languages": ["English", "Malayalam"],
        "fee": 450,
        "about": "Cosmetic and clinical dermatologist."
    }
]
appointments = {}

TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00"]

# ---------------- MODELS ----------------

class AIRequest(BaseModel):
    text: str

class AppointmentCreate(BaseModel):
    date: str
    time: str
    doctor_id: str
    telegram_id: int

class RescheduleRequest(BaseModel):
    date: str
    time: str

# ---------------- AI SPECIALIZATION ----------------

@app.post("/api/ai/specialization")
def detect_specialization(req: AIRequest):
    text = req.text.lower()
    if "heart" in text or "chest" in text:
        return {"specialization": "Cardiology"}
    if "skin" in text or "rash" in text:
        return {"specialization": "Dermatology"}
    return {"specialization": "General"}

# ---------------- DOCTORS ----------------

@app.get("/doctors/by-specialization")
def get_doctors_by_specialization(specialization: str):
    return [d for d in doctors if d["specialization"] == specialization]

# ---------------- AVAILABILITY ----------------

@app.get("/availability")
def get_availability(date: str, doctor_id: str):
    results = []
    for slot in TIME_SLOTS:
        taken = any(
            a["date"] == date and
            a["time"] == slot and
            a["doctor_id"] == doctor_id
            for a in appointments.values()
        )
        results.append({"time": slot, "available": not taken})
    return results

# ---------------- CREATE APPOINTMENT ----------------

@app.post("/api/appointments")
def create_appointment(payload: AppointmentCreate):
    token = str(uuid.uuid4())[:8]

    doctor = next((d for d in doctors if d["id"] == payload.doctor_id), None)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    appointment = {
        "token": token,
        "date": payload.date,
        "time": payload.time,
        "doctor_id": payload.doctor_id,
        "doctor": doctor["name"],
        "specialization": doctor["specialization"],
        "telegram_id": payload.telegram_id,
        "pdf_url": f"http://example.com/receipt/{token}.pdf"
    }

    appointments[token] = appointment
    return appointment

# ---------------- GET APPOINTMENTS ----------------

@app.get("/appointments")
def list_appointments(telegram_id: int):
    return [a for a in appointments.values() if a["telegram_id"] == telegram_id]

@app.get("/appointments/{token}")
def get_appointment(token: str):
    if token not in appointments:
        raise HTTPException(status_code=404, detail="Not found")
    return appointments[token]

@app.patch("/appointments/{token}/reschedule")
def reschedule(token: str, payload: RescheduleRequest):
    if token not in appointments:
        raise HTTPException(status_code=404, detail="Not found")
    appointments[token]["date"] = payload.date
    appointments[token]["time"] = payload.time
    return {"success": True}

@app.delete("/appointments/{token}")
def cancel(token: str):
    if token not in appointments:
        raise HTTPException(status_code=404, detail="Not found")
    del appointments[token]
    return {"success": True}

