from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import admin, doctors, specializations, appointments, patients, banners
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hospital Management System API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "http://192.168.1.9:3000",
        "http://192.168.1.9:5000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(doctors.router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(specializations.router, prefix="/api/specializations", tags=["Specializations"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(banners.router, prefix="/api/banners", tags=["Banners"])

@app.get("/")
async def root():
    return {"message": "Hospital Management System API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

